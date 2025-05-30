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
        console.debug("Attempting to refresh token...");
        const refreshToken = localStorage.getItem("refreshToken"); // Get refresh token
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }
        // Send refresh token in the request body
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, { refreshToken }, { withCredentials: true });

        const { accessToken } = response.data.result || response.data; // Adjust based on backend response structure
        if (!accessToken) {
          throw new Error("No access token in refresh response");
        }

        localStorage.setItem("token", accessToken);
        console.debug("Token refreshed successfully:", accessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError.response?.data || refreshError.message);
        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("refreshToken"); // Clear refresh token as well

        // Only redirect to login if not already on login page and not on admin page
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/admin")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userId");
          if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data);
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/admin")) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
