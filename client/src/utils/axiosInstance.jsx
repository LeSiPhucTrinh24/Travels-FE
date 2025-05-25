import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {}, { withCredentials: true });

        const { accessToken } = response.data;
        localStorage.setItem("token", accessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Only redirect to login if not already on login page and not on admin page
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/login") && !currentPath.includes("/admin")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Handle forbidden access
      console.error("Access forbidden:", error.response.data);
      // Only redirect if not on admin page
      if (!window.location.pathname.includes("/admin")) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
