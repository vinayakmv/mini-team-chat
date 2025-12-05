import React from "react";

export default function OnlineList({ online }) {
  if (!online || online.length === 0) {
    return <div className="text-muted">No one online</div>;
  }

  return (
    <div>
      {online.map((u) => (
        <div
          key={u.id}
          style={{
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div className="avatar">{u.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 600 }}>{u.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
