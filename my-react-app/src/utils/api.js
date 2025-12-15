import { API_URL } from "../config/constants";

/**
 * Build full API URL safely
 */
const buildUrl = (path) => {
  return `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export async function authFetch(endpoint, options = {}, token) {
  const url = buildUrl(endpoint);

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (!token) token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response = await fetch(url, { ...options, headers });

  /* ================= AUTH HANDLING ================= */

  // Forbidden → no retry
  if (response.status === 403) {
    return Promise.reject({
      status: 403,
      errors: {
        _global: "You do not have permission to perform this action.",
      },
    });
  }

  // Unauthorized → try token renewal
  if (response.status === 401) {
    const oldToken = localStorage.getItem("token");

    if (!oldToken) {
      logout();
      throw new Error("Token expired. Please log in again.");
    }

    try {
      const renewRes = await fetch(buildUrl("/auth/renew"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: oldToken }),
      });

      if (!renewRes.ok) throw new Error("Failed to renew token");

      const data = await renewRes.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username })
      );

      headers["Authorization"] = `Bearer ${data.token}`;
      response = await fetch(url, { ...options, headers });

    } catch {
      logout();
      throw new Error("Token expired. Please log in again.");
    }
  }

  /* ================= RESPONSE HANDLING ================= */

  if (response.status === 204) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (data?.errors) {
      return Promise.reject({
        status: response.status,
        errors: data.errors,
      });
    }

    throw new Error(
      data?.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return data;
}

/* ================= HELPERS ================= */

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
