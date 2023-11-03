import { User } from "./globalTypes";

// Function to save the User object to local storage with expiration at 11:59 PM on the current or next Monday (whichever is applicable)
export const saveUserToLocalStorage = (user: User) => {
    try {
        // Calculate the timestamp for the next Monday at 11:59 PM
        const now = new Date();
        const today = now.getDay(); // 0 for Sunday, 1 for Monday, and so on
        const daysUntilMonday = 1 + ((7 - today) % 7); // Calculate days until the next Monday
        const expirationDate = new Date(now);
        expirationDate.setDate(now.getDate() + daysUntilMonday);
        expirationDate.setHours(23, 59, 0, 0);

        const userWithExpiration = {
            user,
            expirationTimestamp: expirationDate.getTime(),
        };

        const userString = JSON.stringify(userWithExpiration);
        localStorage.setItem(`user_${user.startGGID}`, userString);
    } catch (error) {
        console.error('Error saving user to local storage:', error);
    }
};
