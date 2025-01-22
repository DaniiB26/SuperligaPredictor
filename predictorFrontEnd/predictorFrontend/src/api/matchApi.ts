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

// Fetch all matches from the server
export const getAllMatches = async () => {
  return handleApiRequest(
    () => axiosInstance.get("/matches"),
    "Error fetching matches"
  );
};

// Fetch a match by its ID
export const getMatchById = async (id) => {
  return handleApiRequest(
    () => axiosInstance.get(`/matches/${id}`),
    "Error fetching match"
  );
};
