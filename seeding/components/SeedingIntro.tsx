import introStyles from "/styles/Intro.module.css";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import Link from "next/link";
import Sidebar from "../../globalComponents/Sidebar";
import checkmark from "assets/seedingAppPics/checkmark.png";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { firebaseConfig } from "../utility/firebaseConfig";

//props passed from previous step
interface props {
  page: number;
  setPage: (page: number) => void;
  setStartTime: (startTime: number) => void;
}

const provider = new GoogleAuthProvider();
//Initialize Firebase stuff
export const app = initializeApp(firebaseConfig);
const auth = getAuth();

//onboarding page for seeding app
export default function SeedingIntro({ page, setPage, setStartTime }: props) {
  //react hook where auth state gets stored
  const [authState] = useAuthState(auth);

  //handle submit function
  const handleSubmit = () => {
    setStartTime(new Date().getTime());
    setPage(page + 1);
  };

  // Determine if the user is logged in
  const isUserLoggedIn = authState !== null;

  return (
    
    

        <div className={introStyles.content}>
          <div className={introStyles.onboardingHeading}>
          <h1>Smashbase Autoseeder</h1>
          <p>Smash seeding done&nbsp;<em> excellent </em></p>
          </div>
          <div className={introStyles.featuresContainer}>
          <div className={introStyles.featuresCaption}>
            <p>
              This tool automatically accurately seeds your tournament while
              accounting for:
            </p>
          </div>
          <div className={introStyles.features}>
            <div className={introStyles.featureLabel}>
              <p>Location</p>
              <Image
                className={introStyles.checkmark}
                src={checkmark}
                alt="image of a checkmark"
              ></Image>
            </div>
            <div className={introStyles.featureLabel}>
              <p>Play History</p>
              <Image
                className={introStyles.checkmark}
                src={checkmark}
                alt="image of a checkmark"
              ></Image>
            </div>
            <div className={introStyles.featureLabel}>
              <p>Results</p>
              <Image
                className={introStyles.checkmark}
                src={checkmark}
                alt="image of a checkmark"
              ></Image>
            </div>
          </div>
          <div className={introStyles.featuresCaption}>
            <p>
              You can manually adjust parameters to make sure the seeding is to
              your liking.
            </p>
          </div>
          </div>
          <div className={introStyles.bottomCaption}>
            <p>
              For more information, check out our algorithm writeup{" "}
              <Link
                className={introStyles.navLink}
                href={
                  "https://docs.google.com/document/d/11T_aOBnXXaRH4kFjuH-qUoKLZpaW9oW5ndJfoeLsF3M/edit"
                }
                target="_blank"
              >
                here!
              </Link>
            </p>
            <p></p>
          </div>
          <div className={introStyles.seedingFooterContainer}>
            <button
              onClick={handleSubmit}
              disabled={!isUserLoggedIn}
              data-tooltip={
                !isUserLoggedIn ? "Please log in to start seeding" : null
              }
            >
              <p>Start Seeding!</p>
            </button>
          </div>
        </div>
    
   
  );
}
