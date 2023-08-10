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
import apiKeyIsValid from "./modules/apiKeyIsValid";
import tournamentDataIsValid from "./modules/tournamentDataIsValid";
import { ifError } from "assert";
import { rawListeners } from "process";

//Initialize Firebase configuration
export const ApiApp = initializeApp(firebaseConfig);
const auth = getAuth();

export default function ApiKeyStep({ page, setPage, apiKey, setApiKey, setTournaments, }: ApiKeyStepProps) {

  const [errorCode, setErrorCode] = useState<number>(0);

  //this function handles the user's submitted api key
  const handleSubmit = async () => {
    const error = apiKeyIsValid(apiKey);
  
    if (error !== 0) {
      setErrorCode(error);
      return;
    }
  
    try {
      const rawTournamentData = await getTournaments(apiKey!);
      console.log(rawTournamentData)
      const tournamentDataError = tournamentDataIsValid(rawTournamentData);
  
      if (tournamentDataError === 0) {
        setTournaments(apiDataToTournaments(rawTournamentData));
        writeToFirebase("apiKeys/" + auth.currentUser!.uid, apiKey);
        setPage(page + 1);
      } else {
        setErrorCode(tournamentDataError);
      }
    } catch (error) {
      // Handle any exceptions that occur during API calls or processing
      console.error("Error:", error);
      setErrorCode(100)
    }
  };
  

  return (

    <div className={stepStyles.content}>
      <ApiKeyStepImports.Heading />
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

