import { initializeApp, FirebaseOptions } from "firebase/app";
import { getAuth, Auth, User, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "../utility/firebaseConfig";

// Initialize Firebase app
export const app = initializeApp(firebaseConfig as FirebaseOptions);

// Retrieve Firebase Auth instance
export const auth: Auth = getAuth(app);

// Subscribe to changes in the user's authentication state
//this function is to check whether the user is logged in or not
export const subscribeToAuthStateChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
