import styles from "../../../styles/MajorPrompt.module.css"
import SeedingFooter from ".././SeedingFooter";
import scrollIcon from "../../../assets/seedingAppPics/scrollIcon.png"
import scaleIcon from "../../../assets/seedingAppPics/scaleIcon.png"
import chanceTimeIcon from "../../../assets/seedingAppPics/chanceTimeIcon.png"
import Image from "next/image";
import InlineMessage from "@atlaskit/inline-message";
interface majorPromptProps {
    page: number;
    setPage: (page: number) => void;

}

export default function MajorPrompt({ page, setPage }: majorPromptProps) {


    return (

        <div className={styles.content}>

            <div className={styles.headerRow}>
                <div className={styles.heading}>
                    <p>Next Steps...</p>
                </div>
                <div className={styles.headerRowMessage}>Seeding a major with Smashbase requires you to contact us.</div>
            </div>

            <div className={styles.infoRow}>
                <div className={styles.infoHeader}>Perks of using Smashbase for your major event</div>
                <div className={styles.infoRectangle}>
                    <div className={styles.infoInnerRow}>
                       <Image src={scrollIcon} alt="scroll icon"></Image> <p>Speedy seeding - keep registration open longer!</p>
                    </div>
                    <div className={styles.infoInnerRow}>
                       <Image src={chanceTimeIcon} alt="scroll icon"></Image> <p>Accurately seed the entire tournament - not just the top cut.</p>
                    </div>
                    <div className={styles.infoInnerRow}>
                       <Image src={scaleIcon} alt="scroll icon"></Image> <p>Keep seeding objective and fair by working with the best third-party in the game.</p>
                    </div>
                </div>
            </div>

            <div className={styles.vouchRow}>
                <p>TRUSTED SEEDERS OF: </p>
                <div className={styles.vouchRectangle}>
                    <p>CROWN III</p>
                    <p>WAVEDASH 2023</p>
                    <p>GET ON MY LEVEL</p>
                    <p>COINBOX</p>
                </div>
            </div>

            <div className={styles.infoMessage}><InlineMessage appearance="info" iconLabel="Smashbase can also handle all conflict/bracket swap requests." secondaryText="Smashbase can also handle all conflict/bracket swap requests." /></div>





            <div className={styles.seedingFooterContainer}>
                <SeedingFooter
                    page={10}
                    setPage={setPage}

                ></SeedingFooter>
            </div>
        </div>

    );
}



