import stepStyles from "/styles/SeparationStep.module.css";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import LoadingScreen from "../LoadingScreen";
import { useState } from "react";
import SeedingFooter from "../SeedingFooter";
import Image, { StaticImageData } from "next/image";
import CarpoolStep from "./CarpoolStep/CarpoolStep";
import { Carpool, Player } from "../../definitions/seedingTypes";
import writeToFirebase from "../../modules/writeToFirebase";
import { getAuth } from "firebase/auth";
import InlineMessage from "@atlaskit/inline-message";
import * as imports from "./modules/separationStepIndex"
const auth = getAuth();
interface phaseGroupDataInterface {
  phaseIDs: number[];
  phaseIDMap: Map<number, number[]>;
  seedIDMap: Map<number | string, number>;
  sets: any[];
}

export default function SeparationStep({
  page,
  setPage,
  apiKey,
  slug,
  preavoidancePlayerList,
  setFinalPlayerList
}: imports.separationStepProps) {
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [showCarpoolPage, setShowCarpoolPage] = useState<boolean>(false);
  const [numTopStaticSeeds, setNumTopStaticSeeds] = useState(1);
  const [conservativity, setConservativity] = useState("moderate");
  const [location, setLocation] = useState("moderate");
  const [historation, setHistoration] = useState("moderate");
  const [carpoolList, setCarpoolList] = useState<Carpool[]>([]);

  //this step's submit function calls the separation function and updates the player list
  async function handleNextSubmit() {

    // data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/numTopStaticSeeds", numTopStaticSeeds);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/separationConservativity", conservativity);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/locationSeparation", location);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/historySeparation", historation);
    setPage(page + 1);
  }

  return (
    <div className={stepStyles.content}>
      <LoadingScreen
        message="Separating players based on your input. The process might take a few seconds up to a couple minutes depending on the number of entrants."
        isVisible={isNextPageLoading}
      />
      {showCarpoolPage ? (
        <CarpoolStep
          key="SeparationStep"
          page={page}
          // setPage={setPage}
          apiKey={apiKey}
          setShowCarpoolPage={setShowCarpoolPage}
          carpoolList={carpoolList}
          setCarpoolList={setCarpoolList}
          setPage={setPage}
          playerList={preavoidancePlayerList}
          setFinalPlayerList={setFinalPlayerList}
        />
      ) : (

        <div className={stepStyles.content}>
          <div className={stepStyles.flexHeader}>
            <imports.SeparationHeading />
            <imports.ShowCarpoolStepButton setShowCarpoolPage={setShowCarpoolPage} />
          </div>
          <div className={stepStyles.settingsMainContainer}>
            <imports.SettingHeader />
            <imports.FormManager
              conservativity={conservativity}
              setConservativity={setConservativity}
              location={location}
              setLocation={setLocation}
              historation={historation}
              setHistoration={setHistoration}
              numTopStaticSeeds={numTopStaticSeeds}
              setNumTopStaticSeeds={setNumTopStaticSeeds}
              preavoidancePlayerList={preavoidancePlayerList}
            />
          </div>

          <div className={globalStyles.seedingFooterContainer}>
            <SeedingFooter
              page={page}
              setPage={setPage}
              handleSubmit={handleNextSubmit}
            ></SeedingFooter>
          </div>
        </div>
      )}
    </div>
  );
}

