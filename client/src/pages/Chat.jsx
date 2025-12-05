import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import MessageList from "../components/MessageList";
import { socket } from "../socket";
import ThemeToggle from "../components/ThemeToggle";

export default function Chat({ user }) {
  const { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]); // array of {id, name}
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const lastEmit = useRef(0);

  useEffect(() => {
    if (!channelId) return;
    fetchMessages(1);

    
    if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => socket.emit("joinChannel", channelId));
    } else {
      socket.emit("joinChannel", channelId);
    }

    const onNew = (msg) => {
      if (!msg) return;
      const msgChannelId = msg.channel?._id ?? msg.channel;
      if (!msgChannelId || String(msgChannelId) !== String(channelId)) return;

      const msgWithFlag = { ...msg, isNew: true };
      setMessages((prev) => [...prev, msgWithFlag]);
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, isNew: false } : m)));
      }, 700);
      scrollToBottom();
    };

    const onTyping = ({ userId, userName }) => {
      if (!userId || userId === (user.id || user._id)) return;

      setTypingUsers((prev) => {
        if (prev.find((u) => u.id === userId)) return prev;
        return [...prev, { id: userId, name: userName || "Someone" }];
      });

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.id !== userId));
      }, 2000);
    };

    socket.on("newMessage", onNew);
    socket.on("typing", onTyping);

    return () => {
      try {
        socket.emit("leaveChannel", channelId);
      } catch (e) {}
      socket.off("newMessage", onNew);
      socket.off("typing", onTyping);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  
  }, [channelId]);

  const fetchMessages = async (p = 1) => {
    try {
      const { data } = await API.get(`/messages/${channelId}?page=${p}&limit=25`);
      if (data.length < 25) setHasMore(false);
      if (p === 1) setMessages(data);
      else setMessages((prev) => [...data, ...prev]);
      setPage(p);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  
  const emitTyping = useCallback(() => {
    const now = Date.now();
    if (now - lastEmit.current < 400) return; 
    lastEmit.current = now;
    socket.emit("typing", {
      channelId,
      userId: user.id || user._id,
      userName: user.name,
    });
  }, [channelId, user]);

  const onChange = (e) => {
    setText(e.target.value);
    emitTyping();

    //For automatically stopping
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
    }, 1500);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    const payload = {
      text: text.trim(),
      sender: user.id || user._id,
      channel: channelId,
      createdAt: new Date(),
    };
    socket.emit("sendMessage", payload);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const loadOlder = () => {
    if (!hasMore) return;
    fetchMessages(page + 1);
  };

  return (
    <div className="app">
      <div className="container">
        <aside className="sidebar" style={{ width: 220 }}>
          <div style={{ fontWeight: 700 }}>Channel</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>{channelId}</div>
        </aside>

        <main className="main">
          <div className="header">
            <h2>Chat</h2>
            <div className="controls">
              <div className="sub">Realtime chat</div>
              <ThemeToggle />
            </div>
          </div>

          <div className="chat-wrap">
            <div className="chat-toolbar">
              <button className="load-more" onClick={loadOlder} disabled={!hasMore}>
                Load older
              </button>
            </div>

            <div className="messages" role="log" aria-live="polite">
              <MessageList messages={messages} currentUserId={user.id || user._id} />
              <div ref={bottomRef} />
            </div>

            <div className="composer">
              <div style={{ flex: 1 }}>
                <input
                  value={text}
                  onChange={onChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message..."
                />
                {typingUsers.length > 0 && (
                  <div className="typing-indicator" aria-live="polite">
                    <div className="typing-dots" aria-hidden>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div style={{ marginLeft: 8 }}>
                      {typingUsers.length === 1
                        ? `${typingUsers[0].name} is typing...`
                        : `${typingUsers.map((u) => u.name).join(", ")} are typing...`}
                    </div>
                  </div>
                )}
              </div>

              <button className="send-btn" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
