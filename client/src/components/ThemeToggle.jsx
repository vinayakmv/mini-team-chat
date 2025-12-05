import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch { return "light"; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  return (
    <button
      className="btn ghost"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      title="Toggle theme"
      style={{ padding: "8px 10px", display: "inline-flex", alignItems: "center", gap: 8 }}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
