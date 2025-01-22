import axiosInstance from "./axiosConfig.js";

// Utility function to handle API requests with error logging
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

// Fetch all predictions for the current user
export const getPredictionsForUser = async (username) => {
  return handleApiRequest(
    () => axiosInstance.get(`/predictions/user/${username}`),
    "Error fetching predictions"
  );
};

// Save a prediction for a match
export const savePrediction = async (matchId, user, homeScore, awayScore) => {
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
export const recalculatePoints = async (username) => {
  return handleApiRequest(
    () => axiosInstance.post(`/predictions/user/${username}/recalculate`),
    "Error recalculating points"
  );
};
