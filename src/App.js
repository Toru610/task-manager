import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm";
import TaskManagement from "./components/Tasks/TaskManagement";
import Navbar from "./components/Auth/Navbar";
import "./components/styles/App.css"; 

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      {user && (
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          onLogout={handleLogout} 
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <TaskManagement user={user} />
            ) : (
              <LoginForm onLogin={handleLogin} theme={theme} />
            )
          }
        />
      </Routes>
    </Router>
  );
}