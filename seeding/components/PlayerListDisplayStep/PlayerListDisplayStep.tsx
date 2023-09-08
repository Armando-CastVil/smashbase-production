
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
  
  console.log(preavoidancePlayerList)
  //handle submit function
  async function handleSubmit() {
    setPage(page + 1);

    //data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/preSeparationSeeding", preavoidancePlayerList.map((c: Player) => c.playerID));
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/skipped", false);
  }

  //handle submit function
  //remove
  

  return (

      <div className={globalStyles.content}>
        <div className={stepStyles.tableContainer}>
          <imports.PlayerListHeading/>
          <imports.playerTable players={preavoidancePlayerList} setPreavoidancePlayerList={setPreavoidancePlayerList} />
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

  );
}
