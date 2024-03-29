
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/CarpoolStep.module.css";
import { useState } from "react";
import LoadingScreen from "../../LoadingScreen";
import { Player } from "../../../definitions/seedingTypes";
import SeedingFooter from "../../SeedingFooter";
import * as imports from "./modules/CarpoolStepIndex"

export default function CarpoolStep({ page, playerList, setShowCarpoolPage, setCarpoolList, carpoolList, setPage,handleSubmit,isNextPageLoading }: imports.carpoolProps) {
  //hook states where we will store the carpools and the name of the current carpool being created
  const [carpoolName, setCarpoolName] = useState<string | undefined>("");

  //hashmap so we can retrieve players by their smashgg ids
  let playerMap: Map<number, Player> = imports.createPlayerMap(playerList)

  

  //return function
  return (
    <div className={globalStyles.content}>
      <div className={globalStyles.content}>
        <div className={stepStyles.flexHeader}>
          <imports.CarpoolHeading />
          <imports.ShowAdvancedSettingsButton setShowCarpoolPage={setShowCarpoolPage}/>
        </div>
        <div className={stepStyles.multiTableContainer}>
          <div className={stepStyles.leftTableContainer}>
            <imports.CarpoolPlayerTable playerList={playerList} carpoolList={carpoolList} playerMap={playerMap} setCarpoolList={setCarpoolList} />
          </div>
          <div className={stepStyles.rightTableContainer}>
            <imports.CarpoolTable playerList={playerList} carpoolList={carpoolList} playerMap={playerMap} setCarpoolList={setCarpoolList} />
            <imports.MakeCarpoolForm carpoolName={carpoolName} setCarpoolName={setCarpoolName} carpoolList={carpoolList} setCarpoolList={setCarpoolList}/>
          </div>
        </div>
        <div className={globalStyles.seedingFooterContainer}>
          <SeedingFooter page={page} setPage={setPage} isDisabled={false} handleSubmit={handleSubmit}></SeedingFooter>
        </div>
      </div>
    </div>
  );
}


