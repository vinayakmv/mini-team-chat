import React, { useState } from "react";
import API from "../api";

export default function NewChannelModal({ onClose, onCreate }) {
  const [name, setName] = useState("");

  const create = async () => {
    if (!name.trim()) return;
    try {
      const { data } = await API.post("/channels", { name });
      onCreate(data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to create");
    }
  };

  return (
    <>
      <div className="overlay" onClick={onClose}/>
      <div className="modal">
        <h3>Create Channel</h3>
        <input placeholder="Channel name" value={name} onChange={e=>setName(e.target.value)} />
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button className="btn" onClick={create}>Create</button>
          <button className="ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  );
}
