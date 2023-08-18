import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/EventDisplayStep.module.css";
import Competitor from "../../classes/Competitor";
import getEntrantsFromSlug from "../../modules/getEntrantsFromSlug";
import sortByRating from "../../modules/sortByRating";
import SeedingFooter from "../SeedingFooter";
import {useState } from "react";
import InlineMessage from "@atlaskit/inline-message";
import queryFirebase from "../../modules/queryFirebase";
import { getAuth } from "firebase/auth";
import writeToFirebase from "../../modules/writeToFirebase";
import * as imports from "./modules/EventDisplayStepIndex"
import getPhaseGroups from "./modules/getPhaseGroups";
const auth = getAuth();

export default function EventDisplayStep({page,setPage,apiKey,events,setInitialPlayerList,setEventSlug,slug,setPhaseGroups}: imports.eventDisplayStepProps) 
{

  
  //this state will manage which events have been selected
  const [checkBoxes, setCheckBoxes] = useState<any[]>(imports.CreateCheckboxes(events, -1));
  const [isBoxSelected, setIsBoxSelected] = useState<boolean>();



  //this variable exists because setting the slug as a state takes too long 
  //so we temporarily store it here
  let instantSlug: string = "";

  //handle submit function after next button is pressed
  const handleSubmit = async () => {
    //index of selected event
    let eventIndex: number = 0;
    //this array will hold the array of competitors that will be passed to the next step
    let tempPlayerList: Competitor[] = [];

    //if no box has been checked, exit submit function
    if (eventIndex == -1) 
    {
      setIsBoxSelected(false)
      return
    }

    //if a checked box was found, go through the submission motions
    else if (eventIndex != -1) 
    {
      instantSlug = events[eventIndex].slug!;
      setEventSlug(instantSlug)
      tempPlayerList = await getEntrantsFromSlug(
        events[eventIndex].slug!,
        apiKey!
      );
    }


    let miniSlug = instantSlug
      .replace("/event/", "__")
      .substring("tournament/".length);
    imports.setRating(tempPlayerList).then((playerListData) => {
      let preSeeding = imports.assignSeeds(sortByRating(playerListData));
      setInitialPlayerList(preSeeding);
      //data collection
      writeToFirebase(
        "/usageData/" +
        auth.currentUser!.uid +
        "/" +
        miniSlug +
        "/preAdjustmentSeeding",
        preSeeding.map((c: Competitor) => c.smashggID)
      );
    });
    setPhaseGroups( await getPhaseGroups(instantSlug, apiKey!));
    
    //data collection
    let startsAddress =
      "/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/numStarts";
    let numStarts = (await queryFirebase(startsAddress)) as number | null;
    if (numStarts == null) numStarts = 0;
    writeToFirebase(startsAddress, numStarts + 1);

    setPage(page + 1);
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
            <InlineMessage
              appearance="error"
              iconLabel="Error! No tournament has been selected."
              secondaryText="Please select a tournament."
            />
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









