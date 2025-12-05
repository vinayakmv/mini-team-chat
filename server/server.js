require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const channelRoutes = require("./routes/channels");
const messageRoutes = require("./routes/messages");

const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

// creating Socket.IO server
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:3000" },
});


const onlineUsers = new Map(); 

io.on("connection", (socket) => {
  // helper to build presence list with names
  const broadcastPresence = () => {
    const presenceList = Array.from(onlineUsers.entries()).map(([id, socketSet]) => {
      const firstSocketId = Array.from(socketSet)[0];
      const s = io.sockets.sockets.get(firstSocketId);
      return { id, name: s?.userName || "Unknown" };
    });
    io.emit("presence", presenceList);
  };

  socket.on("joinApp", (user) => {
    try {
      if (!user || !user.id) return;
      if (!onlineUsers.has(user.id)) onlineUsers.set(user.id, new Set());
      onlineUsers.get(user.id).add(socket.id);

      socket.userId = user.id;
      socket.userName = user.name;

      // broadcast presence with names
      broadcastPresence();
    } catch (err) {
      console.error("joinApp error:", err);
    }
  });

// logout
  socket.on("leaveApp", () => {
    try {
      const id = socket.userId;
      if (!id) return;
      if (onlineUsers.has(id)) {
        onlineUsers.get(id).delete(socket.id);
        if (onlineUsers.get(id).size === 0) onlineUsers.delete(id);
      }
      broadcastPresence();
    } catch (err) {
      console.error("leaveApp error:", err);
    }
  });

  // --- Channel join/leave (rooms) ---
  socket.on("joinChannel", (channelId) => {
    if (!channelId) return;
    socket.join(channelId);
  });

  socket.on("leaveChannel", (channelId) => {
    if (!channelId) return;
    socket.leave(channelId);
  });

  socket.on("typing", ({ channelId, userId, userName }) => {
    if (!channelId) return;
    socket.to(channelId).emit("typing", { userId, userName });
  });

  //  New message: save and broadcast 
  socket.on("sendMessage", async (data) => {
    try {
      if (!data || !data.channel || !data.sender || !data.text) return;
      const msg = await Message.create({
        text: data.text,
        sender: data.sender,
        channel: data.channel,
        createdAt: data.createdAt || Date.now(),
      });
      // sender info to client
      await msg.populate("sender", "name email");
      io.to(data.channel).emit("newMessage", msg);
    } catch (err) {
      console.error("sendMessage error:", err);
      socket.emit("errorMessage", { message: "Unable to send message" });
    }
  });

  // Disconnect cleanup (tab closed / network loss)
  socket.on("disconnect", () => {
    try {
      const id = socket.userId;
      if (id && onlineUsers.has(id)) {
        onlineUsers.get(id).delete(socket.id);
        if (onlineUsers.get(id).size === 0) onlineUsers.delete(id);
      }
      broadcastPresence();
    } catch (err) {
      console.error("disconnect cleanup error:", err);
    }
  });
});

// testing
app.get("/", (req, res) => res.send("Mini Team Chat API running"));

// connect database and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err);
    process.exit(1);
  });
