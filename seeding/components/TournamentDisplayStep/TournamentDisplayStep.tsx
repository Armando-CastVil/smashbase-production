import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/TournamentDisplayStep.module.css";
import SeedingFooter from ".././SeedingFooter";
import InlineMessage from "@atlaskit/inline-message";
import * as imports from "./modules/tournamentDisplayStepIndex";
import { useState } from "react";
export default function TournamentDisplayStep({
  page,
  setPage,
  apiKey,
  tournaments,
  setEvents,
}: imports.tournamentDisplayProps) {

  //this state will manage which tournaments have been selected
  const [checkBoxes, setCheckBoxes] = useState<any[]>(imports.CreateCheckboxes(tournaments, -1));
  const [isBoxSelected, setIsBoxSelected] = useState<boolean>();



  //handle submit function after next button is pressed
  const handleSubmit = async () => {
    //index of selected tournament
    let tourneyIndex: number;
    tourneyIndex = imports.selectedBoxIndex(checkBoxes)

    //if no box has been checked, exit submit function
    if (tourneyIndex == -1) {
      setIsBoxSelected(false)
      return
    }
    //if a checked box was found, go through the submission motions
    else if (tourneyIndex != -1) {
      setIsBoxSelected(true)
      imports.getEvents(apiKey!, tournaments[tourneyIndex].slug!).then((data) => {
        setEvents(imports.apiDataToEvents(data));
      });
      setPage(page + 1);
    }
  }; //end of handle submit


  return (

    <div className={globalStyles.content}>
      <div className={stepStyles.tableContainer}>
        <div className={globalStyles.heading}>
          <p>Select the target tournament</p>
        </div>
        <div className={globalStyles.tableComponent}>
          <imports.CreateTable tournaments={tournaments} checkBoxes={checkBoxes} setCheckBoxes={setCheckBoxes} />
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



