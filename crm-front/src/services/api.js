import axios from "axios";

const API_BASE_URL = "http://localhost:8088/api/v1";
// const API_BASE_URL = "http://192.168.1.19:8088/api/v1";

// const API_BASE_URL = ":8088/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// Request Interceptor (Optional)
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Handle 401 - Expired Token)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try refreshing the token
        console.log("here we are");
        await axios.get(`${API_BASE_URL}/auth/refresh`, {
          withCredentials: true,
        });
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Refresh token expired, logging out...");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
