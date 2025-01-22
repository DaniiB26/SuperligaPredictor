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

// Fetch all leaderboards for the current user
export const getLeaderboards = async () => {
  return handleApiRequest(
    () => axiosInstance.get("/leaderboards"),
    "Error fetching leaderboards"
  );
};

// Join a leaderboard by invitation code
export const joinLeaderboardByCode = async (code) => {
  return handleApiRequest(
    () => axiosInstance.post("/leaderboards/joinLeaderboard", { code }),
    "Error joining leaderboard by code"
  );
};

// Create a new leaderboard
export const createLeaderboard = async (name, ownerUsername, privacy) => {
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
export const getPublicLeaderboard = async () => {
  return handleApiRequest(
    () => axiosInstance.get("/leaderboards/public"),
    "Error fetching public leaderboard"
  );
};

// Add a user to an existing leaderboard
export const addUserToLeaderboard = async (leaderboardId, username) => {
  return handleApiRequest(
    () =>
      axiosInstance.post("/leaderboards/addUser", { leaderboardId, username }),
    "Error adding user to leaderboard"
  );
};
