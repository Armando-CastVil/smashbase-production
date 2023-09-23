
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/PlayerListDisplayStep.module.css";
import * as imports from "./modules/playerListDisplayStepIndex"
import SeedingFooter from "../SeedingFooter";
import React from "react";
import writeToFirebase from "../../../globalComponents/modules/writeToFirebase";
import { Player } from "../../definitions/seedingTypes";
import { auth } from "../../../globalComponents/modules/firebase";


export default function PlayerListDisplayStep({ page, setPage,preavoidancePlayerList, setPreavoidancePlayerList, slug }: imports.playerListDisplayProps) {
  
  //handle submit function
  async function handleSubmit() {
    setPage(page + 1);

    //data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/preSeparationSeeding", preavoidancePlayerList.map((c: Player) => c.playerID));
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
