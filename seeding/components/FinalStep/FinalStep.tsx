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
import { log } from "../../../globalComponents/modules/logs";
import queryFirebase from "../../../globalComponents/modules/queryFirebase";
import InlineMessage from "@atlaskit/inline-message";

export default function FinalStep({ page, setPage, apiKey,initialPlayerList, finalPlayerList, setFinalPlayerList,slug, setEndTime, R1PhaseID,numOfRegionalConflicts,numOfRematchConflicts,carpoolList}: imports.finalStepProps) {
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [hasPlayerListChanged, setHasPlayerListChanged] = useState<boolean>(false);


  //this function pushes the seeding to smashgg
  const handleSubmit = async () => {
    if(await imports.playerListHasChanged(finalPlayerList,slug!,apiKey!))
    {
      setHasPlayerListChanged(true)
      return
    }
    setIsNextPageLoading(true);
    let success = await pushSeeding(finalPlayerList, R1PhaseID!, apiKey!);
    if(!success) throw new Error('push seeding failed')
    else log('seeding pushed')
    //data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/postSeparationSeeding", finalPlayerList.map((p: Player) => p.playerID))
    setEndTime(new Date().getTime());
    setIsNextPageLoading(false);
    setPage(page + 1);
    writeToFirebase('/errors/numSuccesses',parseInt(await queryFirebase('/errors/numSuccesses'))+1)
  };




  return (
    <div className={globalStyles.content}>
      <div>
        <LoadingScreen message="Submitting seeding to start.gg." isVisible={isNextPageLoading} />
      </div>
      <div className={stepStyles.tableContainer}>
        <imports.finalStepHeading numOfRegionalConflicts={numOfRegionalConflicts} numOfRematchConflicts={numOfRematchConflicts} carpoolList={carpoolList} />
        <imports.finalPlayerTable initialPlayers={initialPlayerList} players={finalPlayerList} setFinalPlayerList={setFinalPlayerList} />
        {/* Conditionally render the warning message */}
        {hasPlayerListChanged ? (
          <div className={globalStyles.errorMessages}>
            <InlineMessage appearance="error" iconLabel="Error! Player list was changed during the seeding process, please restart the process." secondaryText="Error! Players were added during the seeding process, please restart the process." />
          </div>
        ) : <imports.finalStepWarning />}
        
      </div>

      <div className={globalStyles.seedingFooterContainer}>
        <SeedingFooter
          page={page}
          setPage={setPage}
          handleSubmit={handleSubmit}
          isDisabled={hasPlayerListChanged}
        ></SeedingFooter>
      </div>
    </div>
  );

}

