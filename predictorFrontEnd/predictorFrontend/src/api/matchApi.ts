import axiosInstance from "./axiosConfig";
import { AxiosResponse, isAxiosError } from "axios";

// Utility function to handle API requests with error logging
const handleApiRequest = async <T>(
  request: () => Promise<AxiosResponse<T>>,
  errorMessage: string
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

// Fetch all matches from the server
export const getAllMatches = async (): Promise<any[]> => {
  return handleApiRequest(
    () => axiosInstance.get("/matches"),
    "Error fetching matches"
  );
};

// Fetch a match by its ID
export const getMatchById = async (id: string): Promise<any> => {
  return handleApiRequest(
    () => axiosInstance.get(`/matches/${id}`),
    "Error fetching match"
  );
};
