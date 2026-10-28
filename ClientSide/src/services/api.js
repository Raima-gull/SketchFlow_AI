import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const path = window.location.pathname;

    const isAuthEndpoint =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register") ||
      error.config?.url?.includes("/auth/me");

    // Only hard-redirect on 401 for protected data endpoints,
    // not for the auth endpoints themselves (prevents redirect loops).
    if (status === 401 && !isAuthEndpoint && !path.includes("/login")) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;