import { create } from "zustand";
import axiosInstance from "../services/api";
import { message } from "antd";

const useAuthStore = create((set) => ({
  employee: null,
  isAuthenticated: false,

  login: async (formData) => {
    try {
      const response = await axiosInstance.post("/auth/login", formData);

      if (response.data.success) {
        message.success(response.data.message || "Login successful!");
        await useAuthStore.getState().checkAuth();
        return true;
      } else {
        message.error(response.data.error || "Login failed");
        return false;
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred";

      if (error.response) {
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          "Login failed";
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      message.error(errorMessage);
      return false;
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({
        employee: res.data.employee,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        employee: null,
        isAuthenticated: false,
      });
      message.warning("Session expired. Please login again.");
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({
        employee: null,
        isAuthenticated: false,
      });
      message.success("Logged out successfully!");
    } catch (error) {
      message.error("Logout failed. Please try again.");
    }
  },
}));

export default useAuthStore;
