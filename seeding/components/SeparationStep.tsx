import styles from '/styles/SeparationStep.module.css'
import LoadingScreen from "./LoadingScreen";
import { useState } from 'react';
import SeedingFooter from './SeedingFooter';
import Competitor from '../classes/Competitor';
import InfoIcon from '@atlaskit/icon/glyph/info'
import LikeIcon from '@atlaskit/icon/glyph/like';
import Image, { StaticImageData } from "next/image";
import lowIcon from "/assets/seedingAppPics/lowIcon.png"
import moderateIcon from "/assets/seedingAppPics/moderateIcon.png"
import highIcon from "/assets/seedingAppPics/highIcon.png"
import CarpoolStep from './CarpoolStep';
import getSeparationVer2 from '../modules/getSeparationVer2';
import buildSeparationMap from '../modules/buildSeparationMap';
import { Carpool } from '../seedingTypes';
import stringToValueHistoration from '../modules/stringToValueHistoration';
import stringToValueLocation from '../modules/stringToValueLocation';
import stringToValueConservativity from '../modules/stringToValueConservativity';
import writeToFirebase from '../modules/writeToFirebase';
import { getAuth } from 'firebase/auth';
const auth = getAuth();
interface phaseGroupDataInterface {
    phaseIDs: number[];
    phaseIDMap: Map<number, number[]>;
    seedIDMap: Map<number | string, number>;
    sets: any[];
}
interface props {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    playerList: Competitor[];
    setPlayerList: (competitors: Competitor[]) => void;
    phaseGroupData: phaseGroupDataInterface | undefined;
    slug: string|undefined
}
export default function SeparationStep({ page, setPage, apiKey, playerList, setPlayerList, phaseGroupData, slug}: props) {
    const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false)
    const [showCarpoolPage, setShowCarpoolPage] = useState<boolean>(false)
    const [numTopStaticSeeds, setNumTopStaticSeeds] = useState(1);
    const [conservativity, setConservativity] = useState('moderate');
    const [location, setLocation] = useState('moderate');
    const [historation, setHistoration] = useState('moderate');
    const [carpoolList, setCarpoolList] = useState<Carpool[]>([]);
  

    //this step's submit function calls the separation function and updates the player list
    async function handleNextSubmit() {
    
        setIsNextPageLoading(true)
        assignSeedIDs(playerList, phaseGroupData);
        setPlayerList(getSeparationVer2(playerList, await buildSeparationMap(
            playerList,
            carpoolList,
            stringToValueHistoration(historation),
            stringToValueLocation(location)
        ),numTopStaticSeeds,stringToValueConservativity(conservativity)));
        setIsNextPageLoading(false)

        // data collection
        let miniSlug = slug!.replace("/event/","__").substring("tournament/".length)
        writeToFirebase('/usageData/'+auth.currentUser!.uid+"/"+miniSlug+'/numTopStaticSeeds',numTopStaticSeeds)
        writeToFirebase('/usageData/'+auth.currentUser!.uid+"/"+miniSlug+'/separationConservativity',conservativity)
        writeToFirebase('/usageData/'+auth.currentUser!.uid+"/"+miniSlug+'/locationSeparation',location)
        writeToFirebase('/usageData/'+auth.currentUser!.uid+"/"+miniSlug+'/historySeparation',historation)

        setPage(page + 1);
      }





    let iconSrc: StaticImageData;

    switch (conservativity) {
        case "none":
            iconSrc = lowIcon;
            break;
        case "low":
            iconSrc = lowIcon;
            break;
        case "moderate":
            iconSrc = moderateIcon;
            break;
        case "high":
            iconSrc = highIcon;
            break;
        default:
            iconSrc = lowIcon;
    }

    const handleClick = () => {
        setShowCarpoolPage(true);
    };

    return (
        <div>
            <LoadingScreen message='Separating players based on your input. The process might take a few seconds up to a couple minutes depending on the number of entrants.' isVisible={isNextPageLoading} />
            {
                showCarpoolPage ?
                    <CarpoolStep
                        key="SeparationStep"
                        page={page}
                        // setPage={setPage}
                        apiKey={apiKey}
                        playerList={playerList}
                        setPlayerList={setPlayerList}
                        phaseGroupData={phaseGroupData}
                        setShowCarpoolPage={setShowCarpoolPage}
                        carpoolList={carpoolList}
                        setCarpoolList={setCarpoolList}

                    />
                    :
                    <div className={styles.body}>
                        <h6 className={styles.headingtext}>Separation Settings</h6>
                        <div className={styles.settingsContainer}>
                            <h6 className={styles.text}>Advanced settings</h6>
                            <form onSubmit={handleNextSubmit}>
                                <div className={styles.infoContainer}><p>Conservativity Settings</p><div className={styles.infoIcon}><InfoIcon label='' primaryColor='#C094DE' size='medium' /> </div></div>
                                <div className={styles.menuContainer}>
                                    <div className={styles.iconContainer}>
                                        <Image src={iconSrc} alt="low icon" width={20} height={20} />
                                    </div>
                                    <select
                                        className={styles.menuSelect}
                                        id="separation"
                                        value={conservativity}
                                        onChange={(e) => setConservativity(e.target.value)}
                                    >
                                        <option value="low" className={styles.menuOption}>
                                            Low
                                        </option>
                                        <option value="moderate" className={styles.menuOption}>
                                            Moderate
                                        </option>
                                        <option value="high" className={styles.menuOption}>
                                            High
                                        </option>
                                    </select>
                                </div>


                                <div className={styles.bottomSettings}>

                                    <div className={styles.staticSeedsForm}>
                                        <label htmlFor="selectedPlayers">Enable Static Seeding</label>
                                        <input
                                            className={styles.staticSeedsFormInput}
                                            type="number"
                                            id="selectedPlayers"
                                            min="1"
                                            max={playerList.length}
                                            value={numTopStaticSeeds}
                                            onChange={(e) => setNumTopStaticSeeds(parseInt(e.target.value))}
                                        />
                                        <span>{`Top ${numTopStaticSeeds} players will not be moved`}</span>
                                    </div>

                                    <p>separate by location:</p>

                                    <div className={styles.menuContainer}>


                                        <select
                                            className={styles.menuSelect}
                                            id="location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        >
                                            <option value="none" className={styles.menuOption}>
                                                None
                                            </option>
                                            <option value="low" className={styles.menuOption}>
                                                Low
                                            </option>
                                            <option value="moderate" className={styles.menuOption}>
                                                Moderate
                                            </option>
                                            <option value="high" className={styles.menuOption}>
                                                High
                                            </option>
                                        </select>
                                    </div>

                                    <p>separate by set history:</p>
                                    <div className={styles.menuContainer}>


                                        <select
                                            className={styles.menuSelect}
                                            id="historation"
                                            value={historation}
                                            onChange={(e) => setHistoration(e.target.value)}
                                        >
                                            <option value="none" className={styles.menuOption}>
                                                None
                                            </option>
                                            <option value="low" className={styles.menuOption}>
                                                Low
                                            </option>
                                            <option value="moderate" className={styles.menuOption}>
                                                Moderate
                                            </option>
                                            <option value="high" className={styles.menuOption}>
                                                High
                                            </option>
                                        </select>
                                    </div>





                                </div>

                            </form>
                            <button className={styles.button} onClick={handleClick} >Handle carpools</button>
                        </div>
                        <div className={styles.seedingFooterContainer}>
                            <SeedingFooter page={page} setPage={setPage} handleSubmit={handleNextSubmit} ></SeedingFooter>
                        </div>
                    </div>

            }

        </div>

    )
}

function assignSeedIDs(playerList: Competitor[], phaseGroupData: phaseGroupDataInterface | undefined) {
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].seedID = phaseGroupData!.seedIDMap.get(
        playerList[i].smashggID
      );
    }
  }
  