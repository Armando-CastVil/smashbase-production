import introStyles from "/styles/Intro.module.css";
import * as introImports from "./modules/SeedingIntroIndex"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, subscribeToAuthStateChanges } from "../../../globalComponents/modules/firebase"; // Importing the Firebase function
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { log } from "../../../globalComponents/modules/logs";

//onboarding page for seeding app
export default function SeedingIntro({ page, setPage, setStartTime }:introImports.SeedingIntroProps) {
  // React hook where auth state gets stored
  const [authState] = useAuthState(auth);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    // Make an API request to fetch the response data
    fetch('/api/oauth') // Use the correct path to your API endpoint
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
      
  }, []);

  // React hook where User state gets stored
  const [user, setUser] = useState<User | null>(null); // Add type annotation for user state
  //useEffect triggers during rendering, so anytime a state changes we check if user is logged in.
  useEffect(() => {
    // Subscribe to changes in the user's authentication state
    const unsubscribe = subscribeToAuthStateChanges((currentUser) => {
      setUser(currentUser);
      log(auth.currentUser?.email)
    });
  
    // Unsubscribe from the listener when the component is unmounted
    return () => unsubscribe();
  }, []);
  



  //handle submit function
  const handleSubmit = () => {
    setStartTime(new Date().getTime());
    setPage(page + 1);
    log('Start Seeding!')
  };
  // Determine if the user is logged in
  const isUserLoggedIn = authState !== null;

  return (
    
    <div className={introStyles.content}>
     
      <introImports.SeedingIntroHeading />
      <introImports.SeedingFeatures />
      <introImports.BottomCaption />
      <div className={introStyles.seedingFooterContainer}>
        <button
          onClick={handleSubmit}
          disabled={!isUserLoggedIn}
          data-tooltip={
              !isUserLoggedIn 
              ?"Please log in to start seeding"
              :null
          }
        >
        <p>Start Seeding!</p>
      </button>
    </div>
    </div >
  );
}
