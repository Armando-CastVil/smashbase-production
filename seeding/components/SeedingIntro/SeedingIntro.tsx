import introStyles from "/styles/Intro.module.css";
import * as introImports from "./modules/SeedingIntroIndex"
import { useEffect, useState } from "react";
import { log } from "../../../globalComponents/modules/logs";
import { User } from "../../../globalComponents/modules/globalTypes";
import getTournaments from "../ApiKeyStep/modules/getTournaments";
import tournamentDataIsValid from "../ApiKeyStep/modules/tournamentDataIsValid";
import apiKeyIsValid from "../ApiKeyStep/modules/apiKeyIsValid";
import apiDataToTournaments from "../ApiKeyStep/modules/apiDataToTournaments";
import writeToFirebase from "../../../globalComponents/modules/writeToFirebase";
import { auth } from "../../../globalComponents/modules/firebase";
import LoadingScreen from "../LoadingScreen";


//onboarding page for seeding app
export default function SeedingIntro({ page, setPage, setStartTime,setApiKey,apiKey,setTournaments }: introImports.SeedingIntroProps) {
  // React hook where auth state gets stored
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>();
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<introImports.ErrorCode>(introImports.ErrorCode.None);
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    console.log(currentUser)

    if (currentUser) {
        const userObject = JSON.parse(currentUser);
        userObject.user.rating = Number(userObject.user.rating).toFixed(2); // Round the rating to 2 decimal places
        setApiKey(userObject.user.apiKey)
        setUser(userObject);
        setIsLoggedIn(true);
    }
}, []);







  //handle submit function
  const handleSubmit = async () => {
    setStartTime(new Date().getTime());
    
    setIsNextPageLoading(true)
    //whichever error is returned by the api key check is stored here
    const error = apiKeyIsValid(apiKey);
  

    //if there is an error, set the state to that error
    if (error !== introImports.ErrorCode.None) {
      log('Api key step error: '+error)
      setErrorCode(error);
      setIsNextPageLoading(false)
      return;
    }
  
    try {
      const rawTournamentData = await getTournaments(apiKey!);
      //check if there's an error or not
      const tournamentDataError = tournamentDataIsValid(rawTournamentData);
  
      //continue if no errors
      if (tournamentDataError === introImports.ErrorCode.None) {
        let tourneyObjs = apiDataToTournaments(rawTournamentData)
        setTournaments(tourneyObjs);
        log('tournament slugs: '+JSON.stringify(tourneyObjs.map(obj => obj.slug)))
        writeToFirebase("apiKeys/" + auth.currentUser!.uid, apiKey);
        setPage(page + 1);
      } else {
        //if there's an error then set the error to said error
        log('Tournament Data Error: '+tournamentDataError)
        setErrorCode(tournamentDataError);
      }
    } catch (error:any) {
      // Handle any exceptions that occur during API calls or processing
      if(error.message == introImports.ErrorCode.InvalidAPIKey) {
        log('Invalid Api Key')
        setErrorCode(introImports.ErrorCode.InvalidAPIKey)
      } else {
        throw error;
      }
    }
    setIsNextPageLoading(false)
    setPage(page + 1);

    log('Start Seeding!')
  };
  

  return (

    <div className={introStyles.content}>
      <div>
        <LoadingScreen message="Fetching Tournaments" isVisible={isNextPageLoading} />
      </div>

      <introImports.SeedingIntroHeading />
      <introImports.SeedingFeatures />
      <introImports.BottomCaption />
      <div className={introStyles.seedingFooterContainer}>
        <button
          onClick={handleSubmit}
          disabled={!isLoggedIn}
          data-tooltip={
            !isLoggedIn
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
