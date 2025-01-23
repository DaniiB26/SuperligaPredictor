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

// Fetch all predictions for the current user
export const getPredictionsForUser = async (username: string): Promise<any[]> => {
  return handleApiRequest(
    () => axiosInstance.get(`/predictions/user/${username}`),
    "Error fetching predictions"
  );
};

// Save a prediction for a match
export const savePrediction = async (
  matchId: string,
  user: string,
  homeScore: number,
  awayScore: number
): Promise<any> => {
  return handleApiRequest(
    () =>
      axiosInstance.post("/predictions", {
        user,
        match: { id: matchId },
        predictedHomeScore: homeScore,
        predictedAwayScore: awayScore,
      }),
    "Error saving prediction"
  );
};

// Recalculate points for the current user
export const recalculatePoints = async (username: string): Promise<any> => {
  return handleApiRequest(
    () => axiosInstance.post(`/predictions/user/${username}/recalculate`),
    "Error recalculating points"
  );
};
