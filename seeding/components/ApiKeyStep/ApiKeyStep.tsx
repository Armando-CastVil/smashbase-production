import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/ApiKeyStep.module.css";
import SeedingFooter from "../SeedingFooter";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../utility/firebaseConfig";
import writeToFirebase from "../../modules/writeToFirebase";
import ApiKeyStepProps, * as ApiKeyStepImports from "./modules/ApiKeyStepIndex";
import getTournaments from "./modules/getTournaments";
import apiDataToTournaments from "./modules/apiDataToTournaments";
import { useState } from "react";
import submissionIsValid from "./modules/apiKeyIsValid";
import apiKeyIsValid from "./modules/apiKeyIsValid";
import tournamentDataIsValid from "./modules/tournamentDataIsValid";

//Initialize Firebase configuration
export const ApiApp = initializeApp(firebaseConfig);
const auth = getAuth();


export default function ApiKeyStep({ page, setPage, apiKey, setApiKey, setTournaments, }: ApiKeyStepProps) {

  //value that verifies if key is valid
  //1 is for undefined api key
  //2 is for not valid api key
  //3 is for valid api key
  //4 is for not signed in
  //6 is for not whitelisted
  const [errorCode, setErrorCode] = useState<number>(0);

  //this function handles the user's submitted api key
  const handleSubmit = async () => {

    console.log("handle submit")
    //if the api key is not valid, set error code and exit
    if (apiKeyIsValid(apiKey) !== 10) {
      console.log(apiKeyIsValid(apiKey))
      setErrorCode(apiKeyIsValid(apiKey))
      return;
    }
    //if the api key is valid, then perform the api call
    //1. get data from start.gg
    let rawTournamentData = await getTournaments(apiKey!)

    //2.check if valid, if not, get error code return error code
    if (tournamentDataIsValid(rawTournamentData) == 10) {
      //3. if valid, process data
      setTournaments(apiDataToTournaments(rawTournamentData)!);
      //we only get here if both api key and tournament data are valid
      writeToFirebase("apiKeys/" + auth.currentUser!.uid, apiKey);
      setPage(page + 1);
    }
    else {
      setErrorCode(tournamentDataIsValid(rawTournamentData))
    }
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
        setPage={setPage}
        handleSubmit={handleSubmit}
      />

      <div className={globalStyles.seedingFooterContainer}>
        <SeedingFooter
          page={page}
          setPage={setPage}
          isDisabled={errorCode == 6}
          handleSubmit={handleSubmit}
        ></SeedingFooter>
      </div>
    </div>
  );
}

