import globalStyles from "../../../styles/GlobalSeedingStyles.module.css"
import stepStyles from "../../../styles/FinalStep.module.css"
import { useState } from "react";
import LoadingScreen from "../LoadingScreen";
import SeedingFooter from "../SeedingFooter";
import pushSeeding from "./modules/pushSeeding";
import writeToFirebase from "../../../globalComponents/modules/writeToFirebase";
import * as imports from "./modules/finalStepIndex"
import { Player } from "../../definitions/seedingTypes";
import { auth } from "../../../globalComponents/modules/firebase";

export default function FinalStep({ page, setPage, apiKey,initialPlayerList, finalPlayerList, setFinalPlayerList,slug, setEndTime, R1PhaseID}: imports.finalStepProps) {
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);


  //this function pushes the seeding to smashgg
  const handleSubmit = async () => {
    setIsNextPageLoading(true);
    let success = await pushSeeding(finalPlayerList, R1PhaseID!, apiKey!);
    if(!success) throw new Error('push seeding failed')
    //data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/postSeparationSeeding", finalPlayerList.map((p: Player) => p.playerID))
    setEndTime(new Date().getTime());
    setIsNextPageLoading(false);
    setPage(page + 1);
  };






  //return function
  return (
    <div className={globalStyles.content}>
      <div>
      <LoadingScreen message="Submitting seeding to start.gg." isVisible={isNextPageLoading} />
      </div>
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

