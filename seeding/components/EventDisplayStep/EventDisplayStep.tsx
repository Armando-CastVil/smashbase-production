import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/EventDisplayStep.module.css";
import SeedingFooter from "../SeedingFooter";
import { useEffect, useState } from "react";
import InlineMessage from "@atlaskit/inline-message";
import queryFirebase from "../../../globalComponents/modules/queryFirebase";
import writeToFirebase from "../../../globalComponents/modules/writeToFirebase";
import * as imports from "./modules/EventDisplayStepIndex"
import { Player } from "../../definitions/seedingTypes";
import makeProjectedPaths from "./modules/makeProjectedPaths";
import LoadingScreen from "../LoadingScreen";
import getPhaseAndPhaseGroupIDs from "./modules/getPhaseAndPhaseGroupIDs";
import getSeedData from "./modules/getSeedData";
import setSeedIDs from "./modules/setSeedIDs";
import { auth } from "../../../globalComponents/modules/firebase";
import { log } from "../../../globalComponents/modules/logs";
import GenericProgressBar from "../../../globalComponents/GenericProgressBar";

export default function EventDisplayStep({ page, setPage, apiKey, events, setInitialPlayerList, setPreavoidancePlayerList, setEventSlug, slug, setProjectedPaths, setR1PhaseID, setFinalPlayerList }: imports.eventDisplayStepProps) {

  //this state will manage which events have been selected
  const [checkBoxes, setCheckBoxes] = useState<any[]>(imports.CreateCheckboxes(events, -1));
  const [isBoxSelected, setIsBoxSelected] = useState<boolean>();
  const [areThereEnoughEntrants, setAreThereEnoughEntrants] = useState<boolean>(true)
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [progress, setProgress]=useState<[number, number]>([0,0]);
  const [showProgress, setShowProgress]=useState<boolean>(false);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
 


 

  //this variable exists because setting the slug as a state takes too long 
  //so we temporarily store it here
  let instantSlug: string = "";

  //handle submit function after next button is pressed
  const handleSubmit = async () => {
    setAreThereEnoughEntrants(true)
    setShowProgress(true)
    //index of selected event
    //index of selected tournament
    let eventIndex: number = imports.selectedBoxIndex(checkBoxes)
    setIsBoxSelected(eventIndex != -1);

    //if no box has been checked, exit submit function
    if (eventIndex == -1) {
      setIsBoxSelected(false)
      setIsNextPageLoading(false)
      //log('Tried to advance without selecting an event!')
      return
    }
    //log('video game id: ' + events[eventIndex].videogameId)
   // log('is online: ' + events[eventIndex].online)
    //if a checked box was found, go through the submission motions
    instantSlug = events[eventIndex].slug!;
    setEventSlug(instantSlug)

   
    //this array will hold the array of competitors that will be passed to the next step
    let playerList: Player[] = await imports.getEntrantsFromSlug(
      events[eventIndex].slug!,
      apiKey!,
      events[eventIndex].videogameId == 1,
      events[eventIndex].online,
      setProgress
    );

    console.log("list before sorting:")
    console.log(playerList.length)

    let preSeeding = imports.sortByRating(playerList);
    setInitialPlayerList(preSeeding);
    setPreavoidancePlayerList(preSeeding)
    setFinalPlayerList([])
    log('preseeding: ' + JSON.stringify(preSeeding.map(obj => obj.playerID)))

    // info for get projected paths
    let [phaseIDs, phaseGroupIDs]: [number[], number[]] = await getPhaseAndPhaseGroupIDs(apiKey!, instantSlug);
    setR1PhaseID(phaseIDs[0])
    //log(phaseIDs.length + ' phases')
    //log(phaseGroupIDs.length + ' phasegroups')
   // log('R1 phase id: ' + phaseIDs[0])
    let seedData = await getSeedData(apiKey!, phaseIDs)
    if (notEnoughPlayersError(seedData, playerList.length)) {
      // Set loading to false in case of an error
      setAreThereEnoughEntrants(false);
      setIsNextPageLoading(false);
    } else {
      // Submission successful, set loading to false
      setPage(page + 1);
      setIsNextPageLoading(false);
      setSeedIDs(seedData, playerList)
      log('Seed IDs: ' + JSON.stringify(preSeeding.map(obj => [obj.playerID, obj.seedID])))
      setProjectedPaths(makeProjectedPaths(apiKey!, playerList, seedData, phaseGroupIDs))
    }

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
      {isNextPageLoading ? (
        <div>
          {isTimerRunning && (
            <div>
              Elapsed Time: {elapsedTime} seconds
            </div>
          )}
        </div>
      ) : <></>}
       {showProgress ? (
        <div>
          <GenericProgressBar completed={progress[0]} total={progress[1]}  
          message={`${progress[0]} players out of ${progress[1]} Have Been Fetched`}
          connectingMessage={"Connecting to the Database..."}/>
          </div>
      ) : <></>}
      </div>
      <div className={stepStyles.tableContainer}>
        <div className={globalStyles.heading}>
          <p>Select the target event</p>
        </div>
        <div className={globalStyles.tableComponent}>
          <imports.CreateEventTable events={events} checkBoxes={checkBoxes} setCheckBoxes={setCheckBoxes} />
        </div>
        <div className={globalStyles.errorMessages}><InlineMessage appearance="info" iconLabel="Please do not start seeding until attendees are FINAL." secondaryText="Please do not start seeding until attendees are FINAL." /></div>
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

function notEnoughPlayersError(seedData: any, numPlayers: number): boolean {
  let maxSeed = 0
  for (let i = 0; i < seedData.length; i++) {
    if (seedData[i].seedNum > maxSeed) maxSeed = seedData[i].seedNum
  }
  if (maxSeed > numPlayers) log('not enough players for progression, progression has ' + maxSeed + ", only " + numPlayers + " in event")
  return maxSeed > numPlayers;
}