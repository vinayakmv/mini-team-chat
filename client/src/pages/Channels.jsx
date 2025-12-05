import React, { useEffect, useState } from "react";
import API from "../api";
import ChannelList from "../components/ChannelList";
import OnlineList from "../components/OnlineList";
import NewChannelModal from "../components/NewChannelModal";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { socket } from "../socket";

export default function Channels({ user, setUser }) {
  const [channels, setChannels] = useState([]);
  const [online, setOnline] = useState([]); // store array of userIds (strings)
  const [showModal, setShowModal] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    load();

    // Listen for presence updates from server
    socket.on("presence", (onlineIds) => {
      // onlineIds is an array of user ids (strings)
      setOnline(Array.isArray(onlineIds) ? onlineIds : []);
    });

    return () => {
      socket.off("presence");
    };
  }, []);

  const load = async () => {
    try {
      const { data } = await API.get("/channels");
      setChannels(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onCreate = (c) => setChannels((prev) => [c, ...prev]);

  const logout = () => {
    try { socket.emit("leaveApp"); } catch (e) {}
    localStorage.clear();
    setUser(null);
    nav("/login");
  };

  return (
    <div className="app">
      <div className="container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="brand">
            <div className="logo">MC</div>
            <div>
              <h3>Mini Chat</h3>
              <div className="text-muted">Channels & members</div>
            </div>
          </div>

          <div className="controls" style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn" onClick={() => setShowModal(true)}>
              + New Channel
            </button>
            <button className="ghost" onClick={load}>Refresh</button>
          </div>

          <ul className="channel-list">
            <ChannelList channels={channels} />
          </ul>

          <div className="online">
            <h4>Online</h4>
            <OnlineList online={online} />
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{user.name}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {user.email}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <button className="ghost" onClick={logout}>Logout</button>
            </div>
          </div>
        </aside>

        {/* Main area */}
        <main className="main">
          <div className="header">
            <h2>Welcome, {user.name}</h2>

            {/* Theme Toggle */}
            <div className="controls" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="sub">Select a channel to begin</div>
              <ThemeToggle />
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="text-muted">Choose or create a channel to begin.</div>
          </div>
        </main>
      </div>

      {showModal && (
        <div>
          <div className="overlay" onClick={() => setShowModal(false)} />
          <NewChannelModal onClose={() => setShowModal(false)} onCreate={onCreate} />
        </div>
      )}
    </div>
  );
}
