import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/TournamentDisplayStep.module.css";
import SeedingFooter from ".././SeedingFooter";
import InlineMessage from "@atlaskit/inline-message";
import LoadingScreen from "../LoadingScreen";
import * as imports from "./modules/tournamentDisplayStepIndex";
import { useState } from "react";
export default function TournamentDisplayStep({
  page,
  setPage,
  apiKey,
  tournaments,
  setEvents,
}: imports.tournamentDisplayProps) {

  const checkBoxesData = imports.CreateCheckboxes(tournaments, -1);
  //this state will manage which tournaments have been selected
  const [checkBoxes, setCheckBoxes] = useState<any[]>(checkBoxesData);
  const [isBoxSelected, setIsBoxSelected] = useState<boolean>();
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);

  //handle submit function after next button is pressed
  const handleSubmit = async () => {
    setIsNextPageLoading(true)
    //index of selected tournament
    let tourneyIndex: number= imports.selectedBoxIndex(checkBoxes)

    setIsBoxSelected(tourneyIndex != -1);
    //if a checked box was found, go through the submission motions
    if (tourneyIndex != -1) {
      let rawEventData = await imports.getEvents(apiKey!, tournaments[tourneyIndex].slug!)
      setEvents(imports.apiDataToEvents(rawEventData));
      setPage(page + 1);
    }
    setIsNextPageLoading(true)
  }; //end of handle submit


  return (

    <div className={globalStyles.content}>
      <div>
        <LoadingScreen message="Fetching Events" isVisible={isNextPageLoading} />
      </div>
      <div className={stepStyles.tableContainer}>
        <div className={globalStyles.heading}>
          <p>Select the target tournament</p>
        </div>
        <div className={globalStyles.tableComponent}>
          <imports.CreateTournamentTable tournaments={tournaments} checkBoxes={checkBoxes} setCheckBoxes={setCheckBoxes} />
        </div>
        <div className={globalStyles.errorMessages}>
          {isBoxSelected == false ? (
            <InlineMessage appearance="error" iconLabel="Error! No tournament has been selected." secondaryText="Please select a tournament." />
          ) : (
            <p></p>
          )}
        </div>
      </div>

      <div className={globalStyles.seedingFooterContainer}>
        <SeedingFooter
          page={page}
          setPage={setPage}
          handleSubmit={handleSubmit}
          isDisabled={tournaments.length === 0}
        ></SeedingFooter>
      </div>
    </div>

  );
}



