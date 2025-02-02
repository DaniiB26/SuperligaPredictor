import axiosInstance from "./axiosConfig";

// Fetch real match standings
export const getRealStandings = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get("/standings/real");
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching real standings:", error);
    throw error;
  }
};

// Fetch prediction standings for the logged-in user
export const getPredictionStandings = async (user: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/standings/prediction", {
      params: { username: user },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching prediction standings:", error);
    throw error;
  }
};
