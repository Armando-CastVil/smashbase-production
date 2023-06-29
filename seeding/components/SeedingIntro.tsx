import styles from "/styles/Intro.module.css";
import SeedingFooter from "./SeedingFooter";
import Image from "next/image";
import TOPicture from "assets/seedingAppPics/TOPicture.jpg";
import Link from "next/link";
import { useEffect, useState } from "react";
import InlineMessage from "@atlaskit/inline-message";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "../utility/firebaseConfig";
import { initializeApp } from "firebase/app";
import SignInOut from "../../globalComponents/SignInOut";


//Initialize Firebase configuration
export const app = initializeApp(firebaseConfig);
const auth = getAuth();

//props passed from previous step
interface props {
  page: number;
  setPage: (page: number) => void;
  setStartTime: (startTime: number) => void;
}
//onboarding page for seeding app
export default function SeedingIntro({ page, setPage, setStartTime }: props) {
  const [errorStatus, setErrorStatus] = useState<number>(1);
  const [authState] = useAuthState(auth);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("signed in");
        setErrorStatus(0);
      } else {
        console.log("not signed in");
        setErrorStatus(1);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  function handleSubmit() {
    setStartTime(new Date().getTime());
    setPage(page + 1);
  }
  return (
    <div className={styles.onboardingMain}>
      <div className={styles.onboardingContainer}>
        <div className={styles.onboardingHeading}>
          <h1>Welcome to SmashBase Autoseeder!</h1>
          <p>
            Smash seeding done&nbsp;<i> excellent. </i>
          </p>
        </div>
        <div className={styles.onboardingInfo}>
          <p>
            This tool automatically seeds your tournament while taking: skill,
            location, play history, and other variables into account.
            <br></br>
            Questions? You can reach us through our our email at{" "}
            <a
              className={styles.onboardingLink}
              href="mailto:smashbaseproject@gmail.com"
            >
              smashbaseproject@gmail.com
            </a>{" "}
            or our socials at{" "}
            <Link
              className={styles.onboardingLink}
              href="https://twitter.com/Smashbasegg"
              target="blank"
            >
              Twitter{" "}
            </Link>{" "}
            and{" "}
            <Link
              className={styles.onboardingLink}
              href="https://discord.gg/3u8GFFd6Nh"
              target="blank"
            >
              Discord{" "}
            </Link>
            .
          </p>
        </div>
        <div className={styles.onboardingEstimate}>
          <p>This process should take about 5 minutes.</p>
          <div className={styles.signInOutButton}><SignInOut auth={auth} authState={authState} /></div>
        </div>
        <div className={styles.errorMessages}>
          {errorStatus == 1 ? (
            <div>
              <InlineMessage
                appearance="error"
                iconLabel="Error! Please sign in. Make sure you're not using incognito mode and cookies are enabled."
                secondaryText="Please sign in in order to continue."
              >
                <p>Please sign in in order to continue.</p>
              </InlineMessage>
            </div>
          ) : (
            <p></p>
          )}
        </div>
      </div>

      <div className={styles.seedingFooterContainer}>
        <SeedingFooter
          page={page}
          setPage={setPage}
          handleSubmit={handleSubmit}
          isDisabled={errorStatus == 1}
        ></SeedingFooter>
      </div>
    </div>
  );
}
