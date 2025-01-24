import axios, { AxiosResponse, isAxiosError } from "axios";
import axiosInstance from "./axiosConfig";
import { Leaderboard } from "../types";

type ApiRequest<T> = () => Promise<AxiosResponse<T>>;
type ErrorHandler = string;

// Utility function to handle API requests with error logging
const handleApiRequest = async <T>(
  request: ApiRequest<T>,
  errorMessage: ErrorHandler
): Promise<T> => {
  try {
    const response = await request();
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(`${errorMessage}:`, error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error(`${errorMessage}:`, error.message);
    } else {
      console.error(`${errorMessage}: Unknown error`);
    }
    throw error;
  }
};

// Fetch all leaderboards for the current user
export const getLeaderboards = async (): Promise<any[]> => {
  return handleApiRequest(
    () => axiosInstance.get("/leaderboards"),
    "Error fetching leaderboards"
  );
};

// Join a leaderboard by invitation code
export const joinLeaderboardByCode = async (code: string): Promise<any> => {
  return handleApiRequest(
    () => axiosInstance.post("/leaderboards/joinLeaderboard", { code }),
    "Error joining leaderboard by code"
  );
};

// Create a new leaderboard
export const createLeaderboard = async (
  name: string,
  ownerUsername: string,
  privacy: string
): Promise<any> => {
  return handleApiRequest(
    () =>
      axiosInstance.post("/leaderboards/create", {
        name,
        ownerUsername,
        privacy,
      }),
    "Error creating leaderboard"
  );
};

// Get the public leaderboard
export const getPublicLeaderboard = async (): Promise<Leaderboard | null> => {
  try {
      const response = await axiosInstance.get('/leaderboards/public');
      const data = response.data;

      // Verifică dacă datele sunt valide
      if (data && data.id && data.name && Array.isArray(data.users)) {
          return data as Leaderboard;
      } else {
          console.warn("Invalid public leaderboard data:", data);
          return null;
      }
  } catch (error) {
      console.error("Error fetching public leaderboard:", error);
      throw error;
  }
};


// Add a user to an existing leaderboard
export const addUserToLeaderboard = async (
  leaderboardId: string,
  username: string
): Promise<any> => {
  return handleApiRequest(
    () =>
      axiosInstance.post("/leaderboards/addUser", { leaderboardId, username }),
    "Error adding user to leaderboard"
  );
};
