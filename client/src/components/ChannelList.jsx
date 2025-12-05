import React from "react";
import { Link } from "react-router-dom";

export default function ChannelList({ channels }) {
  return (
    <>
      {channels.map(c => (
        <li key={c._id} className="channel-item">
          <Link to={`/chat/${c._id}`} style={{textDecoration:'none',color:'inherit',display:'flex',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div className="name"># {c.name}</div>
              <div className="meta">{(c.members||[]).length} members</div>
            </div>
            <div style={{fontSize:12,color:'#6b7280'}}>&gt;</div>
          </Link>
        </li>
      ))}
    </>
  );
}
