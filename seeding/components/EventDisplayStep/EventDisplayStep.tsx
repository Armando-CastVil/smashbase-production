import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/EventDisplayStep.module.css";
import SeedingFooter from "../SeedingFooter";
import { useState } from "react";
import InlineMessage from "@atlaskit/inline-message";
import queryFirebase from "../../modules/queryFirebase";
import { getAuth } from "firebase/auth";
import writeToFirebase from "../../modules/writeToFirebase";
import * as imports from "./modules/EventDisplayStepIndex"
import { Player } from "../../definitions/seedingTypes";
import makeProjectedPaths from "./modules/makeProjectedPaths";
const auth = getAuth();

export default function EventDisplayStep({ page, setPage, apiKey, events, setInitialPlayerList, setPreavoidancePlayerList, setEventSlug, slug, setProjectedPaths }: imports.eventDisplayStepProps) {

  //this state will manage which events have been selected
  const [checkBoxes, setCheckBoxes] = useState<any[]>(imports.CreateCheckboxes(events, -1));
  const [isBoxSelected, setIsBoxSelected] = useState<boolean>();

  //this variable exists because setting the slug as a state takes too long 
  //so we temporarily store it here
  let instantSlug: string = "";

  //handle submit function after next button is pressed
  const handleSubmit = async () => {
    setPage(page + 1);
    //index of selected event
    //index of selected tournament
    let eventIndex: number = imports.selectedBoxIndex(checkBoxes)

    setIsBoxSelected(eventIndex != -1);

    //if no box has been checked, exit submit function
    if (eventIndex == -1) {
      setIsBoxSelected(false)
      return
    }
    //if a checked box was found, go through the submission motions
    instantSlug = events[eventIndex].slug!;
    setEventSlug(instantSlug)
    //this array will hold the array of competitors that will be passed to the next step
    let playerList: Player[] = await imports.getEntrantsFromSlug(
      events[eventIndex].slug!,
      apiKey!
    );

    //data collection
    let miniSlug = instantSlug.replace("/event/", "__").substring("tournament/".length);
    let preSeeding = imports.assignSeeds(imports.sortByRating(playerList));
    setInitialPlayerList(preSeeding);
    setPreavoidancePlayerList(preSeeding)
    //data collection
    let startsAddress = "/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/numStarts";
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/preAdjustmentSeeding", preSeeding.map((c: Player) => c.playerID));
    let numStarts = (await queryFirebase(startsAddress)) as number | null;
    if (numStarts == null) numStarts = 0;
    writeToFirebase(startsAddress, numStarts + 1);
    setProjectedPaths(makeProjectedPaths(apiKey!, instantSlug, playerList))
  }//end of handle submit function

  return (

    <div className={globalStyles.content}>
      <div className={stepStyles.tableContainer}>
        <div className={globalStyles.heading}>
          <p>Select the target event</p>
        </div>
        <div className={globalStyles.tableComponent}>
          <imports.CreateEventTable events={events} checkBoxes={checkBoxes} setCheckBoxes={setCheckBoxes} />
        </div>
        <div className={globalStyles.errorMessages}>
          {isBoxSelected == false ? (
            <InlineMessage appearance="error" iconLabel="Error! No tournament has been selected." secondaryText="Please select an event." />
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
          isDisabled={events.length === 0}
        ></SeedingFooter>
      </div>
    </div>

  );
};








