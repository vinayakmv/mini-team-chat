⭐ Mini Team Chat Application

A real-time, channel-based team chat application built with React, Node.js, Express, MongoDB, and Socket.IO.
Supports user authentication, channels, messaging, typing indicator, online presence detection, dark mode, and a clean UI.


🚀 Live Demo (Video) 
https://drive.google.com/file/d/1dSgUSFfdEfGJNJdO8y7jTi7mlcRuNBCs/view?usp=sharing


🧠 Features
🔐 Authentication
Register and Login using JWT
Protected routes for chat
Auto-session restore

💬 Real-time Messaging
Send & receive messages instantly using Socket.IO
Typing indicator
Message animations
Infinite scroll (Load older messages)

👥 Channels & Members
Create channels
Join different channels
Channel-based message rooms

🟢 Online Presence Detection
Shows which users are online
Updates dynamically when users join/leave

✨ Modern UI + Dark Mode
Clean and professional UI
Smooth shadows & animations
Fully responsive layout
One-click Dark/Light theme toggle

⚙️ Other Features
Centralized API service
Error and edge-case handling
Reusable React components
Fully scalable folder structure

🛠️ Tech Stack
Frontend
React (CRA)
React Router DOM
Axios
Socket.IO Client
CSS (Custom + Utility styles)

Backend
Node.js
Express.js
MongoDB + Mongoose

📁 Folder Structure

mini-team-chat/
│
├── client/              # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles.css
│   │   ├── api.js
│   │   ├── socket.js
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
│
├── server/              # Node Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md



🧩 How It Works (System Flow)
1️⃣ User Authentication
User registers or logs in
Server issues JWT token
Token stored in localStorage
Protected routes check token

2️⃣ Socket Connection
Once logged in:
socket.emit("joinApp", { id: user._id, name: user.name });
Server tracks online users in memory and broadcasts presence.

3️⃣ Channels
User selects or creates a channel
Client sends:
socket.emit("joinChannel", channelId)

4️⃣ Messaging

Messages are stored in MongoDB
Sent instantly using:
socket.emit("sendMessage", payload)
Server broadcasts to everyone in that channel.

5️⃣ Typing Indicator

When user types, client emits:
socket.emit("typing", { channelId, userId })
Server forwards to other users.

▶️ Setup & Installation
1️⃣ Clone the repository
git clone https://github.com/YOUR_USERNAME/mini-team-chat.git
cd mini-team-chat

2️⃣ Install Backend Dependencies
cd server
npm install


Create .env:

MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
PORT=5000


Start server:

npm run dev

3️⃣ Install Frontend Dependencies
cd ../client
npm install
npm start

🎯 Future Improvements

Direct messages (DMs)

File uploads

Emojis & reactions

Admin/moderator roles

Channel notifications

JSON Web Tokens (JWT)

Socket.IO Server
