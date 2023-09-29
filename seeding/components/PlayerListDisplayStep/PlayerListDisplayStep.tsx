
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/PlayerListDisplayStep.module.css";
import * as imports from "./modules/playerListDisplayStepIndex"
import SeedingFooter from "../SeedingFooter";
import React, { useState } from "react";
import writeToFirebase from "../../../globalComponents/modules/writeToFirebase";
import { Player } from "../../definitions/seedingTypes";
import { auth } from "../../../globalComponents/modules/firebase";


export default function PlayerListDisplayStep({ page, setPage,preavoidancePlayerList, setPreavoidancePlayerList, slug, finalPlayerList,setFinalPlayerList }: imports.playerListDisplayProps) {
  
  const [wasPlayerListChanged, setWasPlayerListChanged] = useState<boolean>(false)
  //handle submit function
  async function handleSubmit() {
    if(finalPlayerList.length!=0 && wasPlayerListChanged==true)
    {
      console.log("final list wasnt empty but it is now lol")
      setFinalPlayerList([])
    }
    setPage(page + 1);
    //data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/preSeparationSeeding", preavoidancePlayerList.map((c: Player) => c.playerID));
  }

 
  return (

      <div className={globalStyles.content}>
        <div className={stepStyles.tableContainer}>
          <imports.PlayerListHeading/>
          <imports.playerTable players={preavoidancePlayerList} setPreavoidancePlayerList={setPreavoidancePlayerList} setWasPlayerListChanged={setWasPlayerListChanged}/>
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
