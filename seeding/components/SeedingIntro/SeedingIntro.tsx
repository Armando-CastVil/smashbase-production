import introStyles from "/styles/Intro.module.css";
import * as introImports from "./modules/SeedingIntroIndex"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, subscribeToAuthStateChanges } from "../../../globalComponents/modules/firebase"; // Importing the Firebase function
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { log } from "../../../globalComponents/modules/logs";
import Cookies from "js-cookie";

//onboarding page for seeding app
export default function SeedingIntro({ page, setPage, setStartTime }: introImports.SeedingIntroProps) {
  // React hook where auth state gets stored
  const [authState] = useAuthState(auth);
  const [oauthData, setOAuthData] = useState(null);
  useEffect(() => {
    // Retrieve the OAuth response data from the client-side cookie
    const storedOAuthData = Cookies.get('oauthData');

    if (storedOAuthData) {
      // Parse the stored data if it's JSON
      const parsedData = JSON.parse(storedOAuthData);
      console.log("cookie data:")
      console.log(parsedData)
      setOAuthData(parsedData);
    }

    // You can now use 'oauthData' in your component
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
              ? "Please log in to start seeding"
              : null
          }
        >
          <p>Start Seeding!</p>
        </button>
      </div>
    </div >
  );
}
