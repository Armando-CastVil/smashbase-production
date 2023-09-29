import stepStyles from "/styles/SeparationStep.module.css";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import LoadingScreen from "../LoadingScreen";
import { useEffect, useState } from "react";
import SeedingFooter from "../SeedingFooter";
import { Carpool, Player } from "../../definitions/seedingTypes";
import writeToFirebase from "../../../globalComponents/modules/writeToFirebase";
import * as imports from "./modules/separationStepIndex"
import { auth } from "../../../globalComponents/modules/firebase";
import { log } from "../../../globalComponents/modules/logs";
import numRegionConflicts from "./modules/numRegionConflicts";
import numRematchConflicts from "./modules/numRematchConflicts";

export default function SeparationStep(
  { page,
    setPage,
    slug,
    preavoidancePlayerList,
    projectedPaths,
    finalPlayerList,
    setFinalPlayerList,
    numTopStaticSeeds,
    setNumTopStaticSeeds,
    conservativity,
    setConservativity,
    location,
    setLocation,
    historation,
    setHistoration,
    carpoolList,
    setCarpoolList,
    setNumOfRegionalConflicts,
    setNumOfRematchConflicts
  }: imports.separationStepProps) {
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [showCarpoolPage, setShowCarpoolPage] = useState<boolean>(true);
  const [ogNumTopStaticSeeds, setOgNumTopStaticSeeds] = useState<number>(numTopStaticSeeds);
  const [ogConservativity, setOgConservativity] = useState<string>(conservativity);
  const [ogLocation, setOgLocation] = useState<string>(location);
  const [ogHistoration, setOgHistoration] = useState<string>(historation);
  const [ogCarpoolList, setOgCarpoolList] = useState<Carpool[]>(carpoolList);


  function haveSettingsChanged() {
    const numTopStaticSeedsChanged = numTopStaticSeeds !== ogNumTopStaticSeeds;
    const conservativityChanged = conservativity !== ogConservativity;
    const locationChanged = location !== ogLocation;
    const historationChanged = historation !== ogHistoration;
    const carpoolListChanged = JSON.stringify(carpoolList) !== JSON.stringify(ogCarpoolList);

    return (
      numTopStaticSeedsChanged ||
      conservativityChanged ||
      locationChanged ||
      historationChanged ||
      carpoolListChanged
    );
  }

  //this step's submit function calls the separation function and updates the player list
  async function handleNextSubmit() {
    // Check if settings have changed
    const settingsChanged = haveSettingsChanged();
    console.log("settings changed:")
    console.log(settingsChanged)
    var doesFinalListNeedUpdating:boolean=false;
    
    if(settingsChanged || finalPlayerList.length==0)
    {
      doesFinalListNeedUpdating=true;
    }
    

    setIsNextPageLoading(true)
    log('Show Carpool Page ' + showCarpoolPage)
    log('Num Top Static Seeds ' + numTopStaticSeeds)
    log('Conservativity ' + conservativity)
    log('Location ' + location)
    log('Historation ' + historation)
    log('Carpool List ' + JSON.stringify(carpoolList))
    let resolvedProjectedPaths: number[][] = await projectedPaths!
    log('Projected Paths resolved')
    if (location == "none" && historation == "none") {
      log('Skipping Avoidance seeding because location and historation are both none')
      setFinalPlayerList(preavoidancePlayerList)
    } 
    
    else if(doesFinalListNeedUpdating) {
      let finalList: Player[] = await imports.avoidanceSeeding(
        preavoidancePlayerList,
        resolvedProjectedPaths,
        carpoolList,
        numTopStaticSeeds,
        imports.stringToValueConservativity(conservativity),
        imports.stringToValueHistoration(historation),
        imports.stringToValueLocation(location)
      );
      console.log(numRegionConflicts(preavoidancePlayerList,resolvedProjectedPaths))
      console.log(numRegionConflicts(finalList,resolvedProjectedPaths))
      console.log(numRematchConflicts(preavoidancePlayerList,resolvedProjectedPaths))
      console.log(numRematchConflicts(finalList,resolvedProjectedPaths))
      setNumOfRegionalConflicts(Math.max(0,numRegionConflicts(preavoidancePlayerList,resolvedProjectedPaths) - numRegionConflicts(finalList, resolvedProjectedPaths)))
      setNumOfRematchConflicts(Math.max(0,numRematchConflicts(preavoidancePlayerList,resolvedProjectedPaths) - numRematchConflicts(finalList, resolvedProjectedPaths)))
      log('Final Player List: ' + JSON.stringify(finalList))
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

      {isNextPageLoading ? <div>
        <LoadingScreen message="Running avoidance seeding. The process might take a few seconds up to a couple minutes depending on the number of entrants." isVisible={isNextPageLoading} />
      </div> : <></>}
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

