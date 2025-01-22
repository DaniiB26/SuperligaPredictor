import axiosInstance from "./axiosConfig";
import { isTokenExpired } from "../utils/TokenUtils";

// Utility function to get the token from localStorage
const getToken = () => localStorage.getItem("token");

// Generic function to handle API requests
const handleApiRequest = async (request, errorMessage) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    console.error(
      `${errorMessage}:`,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Sign up function
export const signup = async (username, email, password) => {
  return handleApiRequest(
    () => axiosInstance.post("/signup", { username, email, password }),
    "Error during signup"
  );
};

// Login function
export const login = async (username, password) => {
  return handleApiRequest(
    () => axiosInstance.post("/login", { username, password }),
    "Error during login"
  );
};

// Get protected data function
export const getProtectedData = async () => {
  const token = getToken();

  if (isTokenExpired(token)) {
    console.warn("Token has expired, redirecting to login.");
    window.location.href = "/login";
    return;
  }

  return handleApiRequest(
    () =>
      axiosInstance.get("/protected-route", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    "Error fetching protected data"
  );
};
