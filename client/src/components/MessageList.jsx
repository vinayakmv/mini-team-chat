import React, { useEffect, useRef } from "react";

export default function MessageList({ messages = [], currentUserId }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // to scroll to the bottom when messages change
    setTimeout(() => {
      containerRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  }, [messages]);

  return (
    <div ref={containerRef}>
      {messages.map((m) => {
        const senderId = m.sender?._id || m.sender;
        const you = String(senderId) === String(currentUserId);
        const classes = `msg ${you ? "you" : ""} ${m.isNew ? "new" : ""}`;
        return (
          <div key={m._id || Math.random()} className={classes}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: you ? "flex-end" : "flex-start" }}>
              <div className="meta">{m.sender?.name || m.sender?.email || "Unknown"} • {new Date(m.createdAt).toLocaleTimeString()}</div>
              <div className="bubble">{m.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
