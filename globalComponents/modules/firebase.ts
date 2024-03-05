import { initializeApp, FirebaseOptions } from "firebase/app";
import { getAuth, Auth, User, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import { getDatabase } from "firebase/database";
import { FirebasePerformance, getPerformance, PerformanceTrace, trace } from "firebase/performance";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { log } from "./logs";

// Initialize Firebase app
export const app = initializeApp(firebaseConfig as FirebaseOptions);

// Retrieve Firebase Auth instance
export const auth: Auth = getAuth(app);

// Subscribe to changes in the user's authentication state
//this function is to check whether the user is logged in or not
export const subscribeToAuthStateChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Initialize realtime database
export const db = getDatabase()

/*if (typeof window !== undefined) {
  // client-side-only code
  perf = getPerformance(app);
  // Initialize Firebase App Check (replace with your own App Check config)
  // const appCheckConfig = {
  //   provider: new ReCaptchaV3Provider('6LerGNshAAAAALNvgYTgPaPcuAlMQ6pvItf78fK_'),
  //   isTokenAutoRefreshEnabled: true
  //   // Add any other App Check settings you need.
  // };

  // initializeAppCheck(app,appCheckConfig)
}*/

export var perf:FirebasePerformance;

