import {jwtDecode} from "jwt-decode";
interface DecodedToken {
    exp: number; // Expiration time in seconds since the epoch
}

export const isTokenExpired = (token: string | null): boolean => {
    if (!token) {
        return true;
    }

    try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Consider token invalid if decoding fails
    }
};
