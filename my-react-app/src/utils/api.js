import { API_URL } from "../config/constants";

<<<<<<< HEAD
const buildUrl = (path) =>
  `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
=======
/**
 * Build full API URL safely
 */
const buildUrl = (path) => {
  return `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270

export async function authFetch(endpoint, options = {}, token) {
  const url = buildUrl(endpoint);

<<<<<<< HEAD
=======
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
  if (!token) token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response = await fetch(url, { ...options, headers });

<<<<<<< HEAD
  if (response.status === 401 || response.status === 403) {
    if (response.status === 403) {
      return Promise.reject({
        status: 403,
        errors: { _global: "You do not have permission to perform this action." },
      });
    }

=======
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
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
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

<<<<<<< HEAD
        headers["Authorization"] = `Bearer ${data.token}`;
        response = await fetch(url, { ...options, headers });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error("Token expired. Please log in again.");
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
=======
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
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
      throw new Error("Token expired. Please log in again.");
    }
  }

<<<<<<< HEAD
=======
  /* ================= RESPONSE HANDLING ================= */

>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
  if (response.status === 204) return null;

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
<<<<<<< HEAD
    if (data && data.errors) return Promise.reject({ status: response.status, errors: data.errors });
    throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
=======
    if (data?.errors) {
      return Promise.reject({
        status: response.status,
        errors: data.errors,
      });
    }

    throw new Error(
      data?.message || `HTTP ${response.status}: ${response.statusText}`
    );
>>>>>>> 92df3200c4fd31480fe9a3b77da7a3ff466d2270
  }

  return data;
}

/* ================= HELPERS ================= */

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
