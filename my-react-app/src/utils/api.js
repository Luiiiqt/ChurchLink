import { API_URL } from "../config/constants";

const buildUrl = (path) => `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
// utils/api.js
export async function authFetch(endpoint, options = {}, token) {
  const url = `http://localhost:8000/api${endpoint}`;
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    throw new Error("Token expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

