import { create } from "zustand";
import api from "../services/api";

function getUserFromPayload(payload) {
  if (!payload || typeof payload !== "object") return null;

  const candidates = [
    payload.user,
    payload.data?.user,
    payload.data,
    payload.account,
    payload,
  ];

  return (
    candidates.find(
      (candidate) =>
        candidate &&
        typeof candidate === "object" &&
        !Array.isArray(candidate) &&
        (candidate.id ||
          candidate._id ||
          candidate.email ||
          candidate.name ||
          candidate.username)
    ) || null
  );
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "The request could not be completed."
  );
}

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  error: null,

  checkAuth: async () => {
    if (get().isInitialized) return get().user;

    set({ isLoading: true, error: null });

    try {
      const { data } = await api.get("/auth/me");
      const user = getUserFromPayload(data);

      set({
        user,
        isAuthenticated: Boolean(user),
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      return user;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });

      return null;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.post("/auth/login", credentials);
      const user = getUserFromPayload(data);

      if (!user) {
        throw new Error("Login succeeded but user data was missing.");
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      return user;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  register: async (details) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await api.post("/auth/register", details);
      set({ isLoading: false, error: null });
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear local state even if server logout fails
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    }
  },

  updateProfile: async ({ name, avatar }) => {
    const { data } = await api.patch("/auth/profile", { name, avatar });
    const user = getUserFromPayload(data);
    if (user) set({ user });
    return user;
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const { data } = await api.patch("/auth/password", {
      currentPassword,
      newPassword,
    });
    return data;
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;