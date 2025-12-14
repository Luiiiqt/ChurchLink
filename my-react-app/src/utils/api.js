import { API_URL } from "../config/constants";

const buildUrl = (path) => `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

export async function authFetch(endpoint, options = {}, token) {
  const url = buildUrl(endpoint);
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  // FIX: Always get token from localStorage if not passed
  if (!token) token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response = await fetch(url, { ...options, headers });

  // Handle 401 / 403 by trying token renewal
  if (response.status === 401 || response.status === 403) {
    const oldToken = localStorage.getItem("token");
    if (oldToken) {
      try {
        const renewRes = await fetch(buildUrl("/auth/renew"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: oldToken })
        });

        if (!renewRes.ok) throw new Error("Failed to renew token");

        const data = await renewRes.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ username: data.username }));

        // Retry original request with new token
        headers["Authorization"] = `Bearer ${data.token}`;
        response = await fetch(url, { ...options, headers });
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error("Token expired. Please log in again.");
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Token expired. Please log in again.");
    }
  }

  // If response is 204 No Content, return null
  if (response.status === 204) return null;

  // Attempt to parse JSON, but handle empty body gracefully
  const text = await response.text();
  if (!text) return null;

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errJson = JSON.parse(text);
      if (errJson.message) errorMessage = errJson.message;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return JSON.parse(text);
}
