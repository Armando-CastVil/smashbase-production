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
}
export default function SeparationStep({ page, setPage, apiKey, playerList, setPlayerList, phaseGroupData, }: props) {
    async function handleSubmit() {
        setIsNextPageLoading(true)
        console.log("submit function")
        setIsNextPageLoading(false)
        setPage(page + 1)

    }
    const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false)
    const [showCarpoolPage, setShowCarpoolPage] = useState<boolean>(false)
    const [selectedPlayers, setSelectedPlayers] = useState(1);
    const [separation, setSeparation] = useState('low');
    const [separateBySetHistory, setSeparateBySetHistory] = useState(false);
    const [separateByLocation, setSeparateByLocation] = useState(false);



    let iconSrc: StaticImageData;

    switch (separation) {
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
                        setPage={setPage}
                        apiKey={apiKey}
                        playerList={playerList}
                        setPlayerList={setPlayerList}
                        phaseGroupData={phaseGroupData}
                        setShowCarpoolPage={setShowCarpoolPage}
                        
                    />
                    :
                    <div className={styles.body}>
                        <h6 className={styles.headingtext}>Separation Settings</h6>
                        <div className={styles.settingsContainer}>
                            <h6 className={styles.text}>Advanced settings</h6>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.infoContainer}><p>Conservativity Settings</p><div className={styles.infoIcon}><InfoIcon label='' primaryColor='#C094DE' size='medium' /> </div></div>
                                <div className={styles.menuContainer}>
                                    <div className={styles.iconContainer}>
                                        <Image src={iconSrc} alt="low icon" width={20} height={20} />
                                    </div>
                                    <select
                                        className={styles.menuSelect}
                                        id="separation"
                                        value={separation}
                                        onChange={(e) => setSeparation(e.target.value)}
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
                                            value={selectedPlayers}
                                            onChange={(e) => setSelectedPlayers(parseInt(e.target.value))}
                                        />
                                        <span>{`Top ${selectedPlayers} players will not be moved`}</span>
                                    </div>


                                    <div>
                                        <p>Separate by Set History</p>
                                        <label className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                id="separateBySetHistory"
                                                checked={separateBySetHistory}
                                                onChange={() => setSeparateBySetHistory(!separateBySetHistory)}
                                            ></input>
                                            <span className={styles.slider}></span>
                                        </label>
                                    </div>

                                    <div>
                                        <p>Separate by Set History</p>
                                        <label className={styles.switch} htmlFor="separateByLocation">
                                            <input
                                                type="checkbox"
                                                id="separateByLocation"
                                                checked={separateByLocation}
                                                onChange={() => setSeparateByLocation(!separateByLocation)}
                                            ></input>
                                            <span className={styles.slider}></span>
                                        </label>

                                    </div>
                                </div>

                            </form>
                            <button className={styles.button} onClick={handleClick} >Handle carpools</button>
                        </div>
                        <div className={styles.seedingFooterContainer}>
                            <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit} ></SeedingFooter>
                        </div>
                    </div>

            }

        </div>

    )
}