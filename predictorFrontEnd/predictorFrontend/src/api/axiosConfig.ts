import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const axiosInstance = axios.create({
  baseURL: "https://superliga-predictor-backend-0646e7a3f4f2.herokuapp.com/api",  // Asigură-te că url-ul e corect
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Function to refresh the token
const refreshTokenFunction = async (refreshToken: string): Promise<string> => {
  try {
    const response: AxiosResponse<{ token: string }> = await axiosInstance.post(
      "/refresh-token",
      { refreshToken }
    );
    return response.data.token;
  } catch (error) {
    console.error("Failed to refresh token", error);
    throw error;
  }
};

// Add a request interceptor to include the token in the Authorization header
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token) {
      if (config.headers) {
        if (typeof config.headers.set === "function") {
          config.headers.set("Authorization", `Bearer ${token}`);
        } else {
          (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !(error.config as any)._retry
    ) {
      const originalRequest = error.config;
      (originalRequest as any)._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const newToken = await refreshTokenFunction(refreshToken);
          localStorage.setItem("token", newToken);

          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;
          if (originalRequest.headers) {
            (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;
          }

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
