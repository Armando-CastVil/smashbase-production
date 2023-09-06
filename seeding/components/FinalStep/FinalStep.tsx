import globalStyles from "../../../styles/GlobalSeedingStyles.module.css"
import stepStyles from "../../../styles/FinalStep.module.css"
import { FC, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import { getAuth } from "firebase/auth";
import SeedingFooter from "../SeedingFooter";
import { OK } from "../../modules/verifyKeyAndURL";
import pushSeeding from "../../modules/pushSeeding";
import writeToFirebase from "../../modules/writeToFirebase";
import * as imports from "./modules/finalStepIndex"
import { Player } from "../../definitions/seedingTypes";


const auth = getAuth();

export default function FinalStep({ page, setPage, apiKey,initialPlayerList, finalPlayerList, setFinalPlayerList,slug, setEndTime, R1PhaseID}: imports.finalStepProps) {
  //state to shold submit status
  const [submitStatus, setSubmitStatus] = useState(false);
  //state to hold success status
  const [successStatus, setSuccessStatus] = useState<string | undefined>();
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);


  //this function pushes the seeding to smashgg
  const handleSubmit = async () => {
    setIsNextPageLoading(true);
    setSubmitStatus(true);
    try {
      let errors = await pushSeeding(finalPlayerList, R1PhaseID!, apiKey!);
      console.log(errors);
      if (errors === undefined) {
        setSuccessStatus(OK);
      } else {
        setSuccessStatus("unknown error try again");
      }
      setSubmitStatus(true);

      //data collection
      let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
      writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/postSeparationSeeding", finalPlayerList.map((p: Player) => p.playerID)
      );
    } catch (e: any) {
      console.log(e);
      setSuccessStatus("unknown error try again");
      setSubmitStatus(true);
    }
    setEndTime(new Date().getTime());
    setIsNextPageLoading(false);
    setPage(page + 1);
  };






  //return function
  return (
    <div >
      <LoadingScreen message="Submitting seeding to start.gg." isVisible={isNextPageLoading} />
      
        <div className={stepStyles.tableContainer}>
          <imports.finalStepHeading/>
          <imports.finalPlayerTable initialPlayers={initialPlayerList}players={finalPlayerList} setFinalPlayerList={setFinalPlayerList} />
          <imports.finalStepWarning/>
        </div>
        <div className={globalStyles.seedingFooterContainer}>
          <SeedingFooter
            page={page}
            setPage={setPage}
            handleSubmit={handleSubmit}
          ></SeedingFooter>
        </div>
    
    </div>
  );
}

