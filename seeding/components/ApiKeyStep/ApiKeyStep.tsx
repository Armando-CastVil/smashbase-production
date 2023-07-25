import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/ApiKeyStep.module.css";
import Tournament from "../../classes/Tournament";
import axios from "axios";
import { useEffect, useState } from "react";
import SeedingFooter from "../SeedingFooter";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../utility/firebaseConfig";
import queryFirebase from "../../modules/queryFirebase";
import writeToFirebase from "../../modules/writeToFirebase";
import ApiKeyStepProps, * as ApiKeyStepImports from "./modules/ApiKeyStepIndex";

//Initialize Firebase configuration
export const ApiApp = initializeApp(firebaseConfig);
const auth = getAuth();



export default function ApiKeyStep({ page, setPage, apiKey, setApiKey, setTournaments, }: ApiKeyStepProps) {

  //value that verifies if key is valid
  //0 is for api key that hasnt been input
  //1 is for undefined api key
  //2 is for not valid api key
  //3 is for valid api key
  //4 is for not signed in
  //6 is for not whitelisted
  const [errorCode, setErrorCode] = useState<number>(0);

  //this piece of code checks if cookies are enabled
  useEffect(() => {
    const areCookiesEnabled = navigator.cookieEnabled;
    if (!areCookiesEnabled) {
      setErrorCode(10);
    }
    console.log("Cookies enabled:", areCookiesEnabled);
  }, []);

  //this piece of code fills in the user's api key
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fillInApiKey(user);
    });

    return () => {
      unsubscribe();
    };

  }, []);



  //fills in api key
  function fillInApiKey(user: any) {
    //only look for api key if they are logged in and its not already there
    if (!user && apiKey !== "") {
      console.log("the is no user and the apikey is filled in ");
      return;
    }
    if (apiKey !== "") {
      console.log("api key is already filled");
      return;
    }
    const uid = user.uid;
    //pull it from firebase
    queryFirebase("apiKeys/" + uid, 0).then((value) => {
      //check if not whitelisted
      if (value == "not whitelisted") {
        setErrorCode(6);
        return;
      }
      //check firebase first
      else if (value != null) {
        setApiKey(value);
      } else {
        //if its in neither place, just set it to empty string
        setApiKey("");
      }
    });
  }




  return (


    <div className={stepStyles.content}>
      <div className={globalStyles.heading}>
        <p>
          Paste your API key from ‎{" "}
          <a href="https://www.start.gg"> Start.gg</a>
        </p>
      </div>


      <ApiKeyStepImports.EmbeddedVideo />
      <ApiKeyStepImports.ErrorMessage errorCode={errorCode} />
      <ApiKeyStepImports.ApiKeyForm
        errorCode={errorCode}
        setErrorCode={setErrorCode}
        apiKey={apiKey}
        setApiKey={setApiKey}
        setTournaments={setTournaments}
        page={page}
        setPage={setPage} />

      <div className={globalStyles.seedingFooterContainer}>
        <SeedingFooter
          page={page}
          setPage={setPage}
          isDisabled={errorCode == 6}
        ></SeedingFooter>
      </div>

    </div>


  );
}

