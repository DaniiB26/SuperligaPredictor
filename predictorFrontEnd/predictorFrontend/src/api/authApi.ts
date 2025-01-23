import axios from "axios";
import axiosInstance from "./axiosConfig";
import { isTokenExpired } from "../utils/TokenUtils";

// Utility function to get the token from localStorage
const getToken = (): string | null => localStorage.getItem("token");

// Tipuri pentru request și handler
type ApiRequest = () => Promise<any>;
type ErrorHandler = string;

// Generic function to handle API requests
const handleApiRequest = async (
  request: ApiRequest,
  errorMessage: ErrorHandler
): Promise<any> => {
  try {
    const response = await request();
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`${errorMessage}:`, error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error(`${errorMessage}:`, error.message);
    } else {
      console.error(`${errorMessage}: Unknown error`);
    }
    throw error;
  }
};

// Sign up function
export const signup = async (
  username: string,
  email: string,
  password: string
): Promise<any> => {
  return handleApiRequest(
    () => axiosInstance.post("/signup", { username, email, password }),
    "Error during signup"
  );
};

// Login function
export const login = async (
  username: string,
  password: string
): Promise<any> => {
  return handleApiRequest(
    () => axiosInstance.post("/login", { username, password }),
    "Error during login"
  );
};

// Get protected data function
export const getProtectedData = async (): Promise<any> => {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
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
