
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/PlayerListDisplayStep.module.css";
import * as imports from "./modules/playerListDisplayStepIndex"
import SeedingFooter from "../SeedingFooter";
import React from "react";
import writeToFirebase from "../../modules/writeToFirebase";
import { getAuth } from "firebase/auth";
import { Player } from "../../definitions/seedingTypes";

const auth = getAuth();


export default function PlayerListDisplayStep({ page, setPage,preavoidancePlayerList, setPreavoidancePlayerList, slug }: imports.playerListDisplayProps) {
  
  //handle submit function
  async function handleSubmit() {

    //data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/preSeparationSeeding", preavoidancePlayerList.map((c: Player) => c.playerID));
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/skipped", false);
    setPage(page + 1);
  }

  //handle submit function
  async function skipToLast() {

    //data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/preSeparationSeeding", preavoidancePlayerList.map((c: Player) => c.playerID));
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/postSeparationSeeding", preavoidancePlayerList.map((c: Player) => c.playerID));
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/skipped", true);
    setPage(6);
  }

  return (
    <div>
      <imports.LoadingScreen
        message="Fetching data from the database. The process might take a few seconds up to a couple minutes depending on the number of entrants."
        isVisible={preavoidancePlayerList.length == 0}
      />
      <div className={globalStyles.content}>
        <div className={stepStyles.tableContainer}>
          <div className={stepStyles.heading}>
            <p>Manually assign seeds</p>
          </div>

          <imports.playerTable players={preavoidancePlayerList} setPreavoidanceplayerList={setPreavoidancePlayerList} />
          <div className={stepStyles.skipMessage} onClick={skipToLast}>
            <p>
              If your bracket is private or you would like to avoid
              separating by carpool or set history, you can &nbsp;
              <a>skip to the last step by clicking here.</a>{" "}
            </p>
          </div>
        </div>


        <div className={globalStyles.seedingFooterContainer}>
          <SeedingFooter
            page={page}
            setPage={setPage}
            handleSubmit={handleSubmit}
            isDisabled={preavoidancePlayerList.length == 0}
          ></SeedingFooter>
        </div>
      </div>
    </div>

  );
}
