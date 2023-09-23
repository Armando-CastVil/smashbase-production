import stepStyles from "/styles/SeparationStep.module.css";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import LoadingScreen from "../LoadingScreen";
import { useState } from "react";
import SeedingFooter from "../SeedingFooter";
import { Carpool, Player} from "../../definitions/seedingTypes";
import writeToFirebase from "../../../globalComponents/modules/writeToFirebase";
import * as imports from "./modules/separationStepIndex"
import { auth } from "../../../globalComponents/modules/firebase";
import { log } from "../../../globalComponents/modules/logs";

export default function SeparationStep({page,setPage,slug,preavoidancePlayerList,projectedPaths,setFinalPlayerList}: imports.separationStepProps) {
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [showCarpoolPage, setShowCarpoolPage] = useState<boolean>(true);
  const [numTopStaticSeeds, setNumTopStaticSeeds] = useState(1);
  const [conservativity, setConservativity] = useState("moderate");
  const [location, setLocation] = useState("moderate");
  const [historation, setHistoration] = useState("moderate");
  const [carpoolList, setCarpoolList] = useState<Carpool[]>([]);

  //this step's submit function calls the separation function and updates the player list
  async function handleNextSubmit() {
    setIsNextPageLoading(true)
    log('Show Carpool Page '+showCarpoolPage)
    log('Num Top Static Seeds '+numTopStaticSeeds)
    log('Conservativity '+conservativity)
    log('Location '+location)
    log('Historation '+historation)
    log('Carpool List '+JSON.stringify(carpoolList))
    let resolvedProjectedPaths:number[][] = await projectedPaths!
    log('Projected Paths resolved')
    if(location == "none" && historation == "none") {
      log('Skipping Avoidance seeding because location and historation are both none')
      setFinalPlayerList(preavoidancePlayerList)
    } else {
      let finalList:Player[] = imports.avoidanceSeeding(
        preavoidancePlayerList,
        resolvedProjectedPaths,
        carpoolList,
        numTopStaticSeeds,
        imports.stringToValueConservativity(conservativity),
        imports.stringToValueHistoration(historation),
        imports.stringToValueLocation(location)
      );
      log('Final Player List: '+JSON.stringify(finalList))
      setFinalPlayerList(finalList)
    }
    setPage(page + 1);
    setIsNextPageLoading(false)
    // data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/numTopStaticSeeds", numTopStaticSeeds);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/separationConservativity", conservativity);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/locationSeparation", location);
    writeToFirebase("/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/historySeparation", historation);
    
  }

  return (
    <div className={stepStyles.content}>
     
      {isNextPageLoading?<div>
        <LoadingScreen message="Running avoidance seeding. The process might take a few seconds up to a couple minutes depending on the number of entrants." isVisible={isNextPageLoading} />
      </div>:<></>}
      {showCarpoolPage ? (
        <imports.CarpoolStep
          key="SeparationStep"
          page={page}
          setShowCarpoolPage={setShowCarpoolPage}
          carpoolList={carpoolList}
          setCarpoolList={setCarpoolList}
          setPage={setPage}
          playerList={preavoidancePlayerList}
          handleSubmit={handleNextSubmit}
          isNextPageLoading={isNextPageLoading}
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

