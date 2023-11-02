import { User } from "./globalTypes";

// Function to save the User object to local storage
export const saveUserToLocalStorage = (user: User) => {
    try {
        const userString = JSON.stringify(user);
        localStorage.setItem(`user_${user.startGGID}`, userString);
    } catch (error) {
        console.error('Error saving user to local storage:', error);
    }
};