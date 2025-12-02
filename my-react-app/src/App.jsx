import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/pages/Dashboard";
import Home from "./components/pages/Home";
import UserManagement from "./components/pages/UserManagement";
import LoadingScreen from "./LoadingScreen";

export default function App() {
  const [sidebarToggle, setSidebarToggle] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false); // NEW

  function toggleSidebar() {
    setSidebarToggle(!sidebarToggle);
  }

  // LOGIN
  function handleLogin(username, password) {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert("Invalid username or password");
      return;
    }

    // Show loading screen for 1.5 seconds
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
    }, 1500);
  }

  // REGISTER
  function handleRegister(username, password) {
    const exists = users.some((u) => u.username === username);

    if (exists) {
      alert("Username already exists");
      return false;
    }

    const newUser = { username, password };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    alert("Registration successful! You can now log in.");
    setShowRegister(false);
    return true;
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  }

  // If loading → show loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // If NOT logged in → show login or register
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        {!showRegister ? (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        ) : (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        )}
      </div>
    );
  }

  // Logged in → load dashboard
  let pageContent;
  switch (currentPage) {
    case "dashboard":
      pageContent = <Dashboard />;
      break;
    case "home":
      pageContent = <Home />;
      break;
    case "users":
      pageContent = <UserManagement />;
      break;
    default:
      pageContent = <Dashboard />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        status={sidebarToggle}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />

      <div className="flex flex-col flex-1">
        <Header onSidebarToggle={toggleSidebar} />
        <main className="p-6 flex-1 overflow-auto">{pageContent}</main>
      </div>
    </div>
  );
}
