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
import ErrorCode from "../ApiKeyStep/modules/enums";
import LoadingScreen from "../LoadingScreen";
const auth = getAuth();

export default function EventDisplayStep({ page, setPage, apiKey, events, setInitialPlayerList, setPreavoidancePlayerList, setEventSlug, slug, setProjectedPaths, setR1PhaseID }: imports.eventDisplayStepProps) {

  //this state will manage which events have been selected
  const [checkBoxes, setCheckBoxes] = useState<any[]>(imports.CreateCheckboxes(events, -1));
  const [isBoxSelected, setIsBoxSelected] = useState<boolean>();
  const [areThereEnoughEntrants, setAreThereEnoughEntrants] = useState<boolean>(true)
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);

  //this variable exists because setting the slug as a state takes too long 
  //so we temporarily store it here
  let instantSlug: string = "";

  //handle submit function after next button is pressed
  const handleSubmit = async () => {
    setAreThereEnoughEntrants(true)
    setIsNextPageLoading(true)
    //index of selected event
    //index of selected tournament
    let eventIndex: number = imports.selectedBoxIndex(checkBoxes)
    setIsBoxSelected(eventIndex != -1);

    //if no box has been checked, exit submit function
    if (eventIndex == -1) {
      setIsBoxSelected(false)
      setIsNextPageLoading(false)
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

    let preSeeding = imports.assignSeeds(imports.sortByRating(playerList));
    setInitialPlayerList(preSeeding);
    setPreavoidancePlayerList(preSeeding)
    let ppPromise: Promise<number[][]> = makeProjectedPaths(apiKey!, instantSlug, playerList, setR1PhaseID)
    setProjectedPaths(ppPromise)
    ppPromise
    .then(() => {
      // Submission successful, set loading to false
      setPage(page + 1);
      setIsNextPageLoading(false);
      
    })
    .catch((e) => {
      if (e.message == ErrorCode.NotEnoughPlayersInProgression + "") {
        setAreThereEnoughEntrants(false);
        setIsNextPageLoading(false);
      } 
      // Set loading to false in case of an error
      
    });
   
    
   

    //data collection
    let miniSlug = instantSlug.replace("/event/", "__").substring("tournament/".length);
    let startsAddress = "/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/numStarts";
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/preAdjustmentSeeding", preSeeding.map((c: Player) => c.playerID));
    let numStarts = (await queryFirebase(startsAddress)) as number | null;
    if (numStarts == null) numStarts = 0;
    writeToFirebase(startsAddress, numStarts + 1);
  }//end of handle submit function

  return (

    <div className={globalStyles.content}>
      <div>
        <LoadingScreen message="Fetching player data. The process might take a few seconds up to a couple minutes depending on the number of entrants." isVisible={isNextPageLoading} />
      </div>
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
          ) :
            areThereEnoughEntrants ?
              (<p></p>)
              : <InlineMessage appearance="error" iconLabel="Progressions Error: One of the bracket phases has more expected entrants than players entered in the event" secondaryText="Progressions Error: One of the bracket phases has more expected entrants than players entered in the event" />
          }
        </div>
      </div>

      <div className={globalStyles.seedingFooterContainer}>
        <SeedingFooter
          page={page}
          setPage={setPage}
          handleSubmit={handleSubmit}
          isDisabled={events.length === 0 || !areThereEnoughEntrants}
        ></SeedingFooter>
      </div>
    </div>

  );
};








