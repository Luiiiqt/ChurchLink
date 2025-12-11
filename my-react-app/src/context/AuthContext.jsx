import React, { createContext, useContext, useEffect, useState } from "react";

// Make sure your API_URL does NOT include `/api`
// It should just be: http://localhost:8000
import { API_URL } from "../config/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  // Sync token to localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Sync user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = (tokenValue, userObj) => {
    setToken(tokenValue);
    setUser(userObj);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // REGISTER
  const register = async (username, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Register failed");
    }

    return await res.json();
  };

  // LOGIN
const loginRequest = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }

  const data = await res.json(); // expects { token, username }
  login(data.token, { username: data.username }); // ✅ context sync
  return data;
};

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register, loginRequest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
