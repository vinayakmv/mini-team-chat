import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Channels from "./pages/Channels";
import Chat from "./pages/Chat";
import { socket } from "./socket";

export default function App() {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  });

  useEffect(() => {
    // When user logs in or refreshes while logged in
    if (user) {
      // to ensurewhether the socket is connected
      if (!socket.connected) socket.connect();

      const userObj = { id: user.id || user._id, name: user.name };
      socket.emit("joinApp", userObj);

      //for listening  to the connection errors 
      socket.on("connect_error", (err) => {
        console.warn("Socket connect error:", err);
      });
    }

    //for clearing on logout
    return () => {
      if (user) {
        try {
          socket.emit("leaveApp");
        } catch (e) {
          /* ignore */
        }
      }

    };

  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route
          path="/channels"
          element={user ? <Channels user={user} setUser={setUser} /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat/:channelId"
          element={user ? <Chat user={user} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={user ? "/channels" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
