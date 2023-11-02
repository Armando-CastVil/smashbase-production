import { User } from "./globalTypes";

// Function to retrieve the User object from local storage and check if it has expired
export const getUserFromLocalStorage = (startGGID: number): User | null => {
    try {
        const userString = localStorage.getItem(`user_${startGGID}`);
        if (userString) {
            const userWithExpiration = JSON.parse(userString);
            const now = new Date().getTime();
            if (userWithExpiration.expirationTimestamp >= now) {
                return userWithExpiration.user;
            } else {
                // Data has expired, remove it from local storage
                localStorage.removeItem(`user_${startGGID}`);
            }
        }
    } catch (error) {
        console.error('Error retrieving user from local storage:', error);
    }
    return null;
};
