import React from "react";
import "../styles/Navbar.css";

export default function Navbar({ onLogout, theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">Task Manager</h1>
        <button className="logout-btn" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}