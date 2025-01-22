import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// Function to refresh the token
const refreshTokenFunction = async (refreshToken) => {
  try {
    const response = await axiosInstance.post("/refresh-token", {
      refreshToken,
    });
    return response.data.token;
  } catch (error) {
    console.error("Failed to refresh token", error);
    throw error;
  }
};

// Add a request interceptor to include the token in the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      const originalRequest = error.config;
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const newToken = await refreshTokenFunction(refreshToken);
          localStorage.setItem("token", newToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } else {
        // No refresh token available, redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    console.error(
      "API request failed:",
      error.response ? error.response.data : error.message
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
