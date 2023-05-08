import styles from '/styles/SeparationStep.module.css'
import LoadingScreen from "./LoadingScreen";
import { useState } from 'react';
import SeedingFooter from './SeedingFooter';
import Competitor from '../classes/Competitor';
import InfoIcon from '@atlaskit/icon/glyph/info'
import LikeIcon from '@atlaskit/icon/glyph/like';
import Image from "next/image";
import lowIcon from "/assets/seedingAppPics/lowIcon.png"
import moderateIcon from "/assets/seedingAppPics/moderateIcon.png"
import highIcon from "/assets/seedingAppPics/highIcon.png"
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
    const [selectedPlayers, setSelectedPlayers] = useState(1);
    const [separation, setSeparation] = useState('low');
    const [separateBySetHistory, setSeparateBySetHistory] = useState(false);



    return (
        <div>
            <LoadingScreen message='Separating players based on your input. The process might take a few seconds up to a couple minutes depending on the number of entrants.' isVisible={isNextPageLoading} />
            <div className={styles.body}>
                <h6 className={styles.headingtext}>Separation Settings</h6>
                <div className={styles.settingsContainer}>
                    <h6 className={styles.text}>Advanced settings</h6>
                    <form onSubmit={handleSubmit}>

                        <select className={styles.conservativityMenu}
                            id="separation"
                            value={separation}
                            onChange={(e) => setSeparation(e.target.value)}
                        >
                            <option value="low" className={styles.lowIcon}>
                                Low
                                
                            </option>
                            <option value="moderate">
                                Moderate
                                <Image className={styles.conservativityIcons} src={moderateIcon} alt='moderate icon' />
                            </option>
                            <option value="high">
                                High
                                <Image className={styles.conservativityIcons} src={highIcon} alt='high icon' />
                            </option>
                        </select>
                        <div>
                            <label htmlFor="selectedPlayers">Static seeds will be selected here:</label>
                            <input
                                type="number"
                                id="selectedPlayers"
                                min="1"
                                max={playerList.length}
                                value={selectedPlayers}
                                onChange={(e) => setSelectedPlayers(parseInt(e.target.value))}
                            />
                        </div>


                        <div>
                            <label htmlFor="separateBySetHistory">Separate by Set History:</label>
                            <input
                                type="checkbox"
                                id="separateBySetHistory"
                                checked={separateBySetHistory}
                                onChange={() => setSeparateBySetHistory(!separateBySetHistory)}
                            />
                        </div>
                    </form>
                    <button className={styles.button}>Handle carpools</button>
                </div>
                <div className={styles.seedingFooterContainer}>
                    <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit} ></SeedingFooter>
                </div>
            </div>

        </div>

    )
}