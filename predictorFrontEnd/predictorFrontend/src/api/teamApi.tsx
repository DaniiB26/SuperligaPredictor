import axiosInstance from './axiosConfig.js';

// Utility function to handle API requests with error logging
const handleApiRequest = async (request, errorMessage) => {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        console.error(`${errorMessage}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

// Fetch all teams from the server
export const getTeams = async () => {
    return handleApiRequest(
        () => axiosInstance.get('/teams'),
        'Error fetching teams'
    );
};

// Fetch a team by its name
export const getTeamByName = async (name) => {
    return handleApiRequest(
        () => axiosInstance.get(`/teams/${name}`),
        'Error fetching team'
    );
};