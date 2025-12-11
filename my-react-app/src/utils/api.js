import { API_URL } from "../config/constants";

// Get token from localStorage
export const getToken = () => localStorage.getItem("token");

// Authenticated fetch helper
export const authFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  console.log("Fetching:", url, "Token:", token);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers, mode: "cors" });

  if (!res.ok) {
    const text = await res.text();
    console.error("API error:", res.status, text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  try {
    return await res.json();
  } catch (e) {
    return {};
  }
};
