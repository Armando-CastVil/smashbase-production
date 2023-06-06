import styles from '/styles/Outro.module.css'
import Button from '@atlaskit/button/standard-button';
import TOPicture from "assets/seedingAppPics/TOPicture.jpg"
import verifiedCheckMark from "assets/seedingAppPics/verified.png"
import Image from 'next/image';
import Link from 'next/link';
import Competitor from '../classes/Competitor';
interface props {
    slug: string | undefined;
    startTime: number | undefined;
    endTime: number | undefined;
    playerList: Competitor[];
}
export default function SeedingOutro({ slug, startTime, endTime, playerList }: props) {
    let tourneyPage: string = "https://start.gg/" + slug
    let elapsedTime = endTime! - startTime!;


    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);

    const hoursStr = hours !== 0 ? `${hours.toString().replace(/^0+/, '')} hour${hours !== 1 ? 's' : ''} ` : '';
    const minutesStr = minutes !== 0 ? `${minutes.toString().replace(/^0+/, '')} minute${minutes !== 1 ? 's' : ''} ` : '';
    const secondsStr = seconds !== 0 ? `${seconds.toString().replace(/^0+/, '')} second${seconds !== 1 ? 's' : ''}` : '';

    const andStr = minutes !== 0 ? 'and ' : '';

    const timeStr = `${playerList.length} players seeded in ${hoursStr}${minutesStr}${andStr}${secondsStr}.`;
    return (

        <div className={styles.body}>
            <div className={styles.outroContainer}>
                <div className={styles.outroLeft}>
                    <Image className={styles.picture} src={TOPicture} alt="Image of a TO" />
                </div>
                <div className={styles.outroRight}>
                    <h1 className={styles.outroHeading}>Seeding Complete! <Image src={verifiedCheckMark} className={styles.verifiedPicture} alt="verified check mark" /></h1>
                    <p className={styles.outroParagraph}>
                        We're always looking to improve our product and make it the best it can be for our community.
                        That's why we value your feedback! Whether it's a suggestion, bug report, or just general thoughts on the product, we'd love to hear from you.
                        You can reach us through our our email at <a href="mailto:smashbaseproject@gmail.com">smashbaseproject@gmail.com</a> or our socials at <Link href="https://twitter.com/Smashbasegg" target='blank' >Twitter </Link> and <Link href="https://discord.gg/3u8GFFd6Nh" target='blank' >Discord </Link>.
                    </p>

                </div>




            </div>

            <p className={styles.time}>{timeStr}</p>

            <div className={styles.seedAppFooter}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginRight: "auto", marginLeft: "auto", gap: "5%" }}>
                    <a href="https://beta.smashbase.gg" ><Button appearance="primary"> Return to Home </Button></a>
                    <a href={tourneyPage} target="_blank"><Button appearance="primary"> Go to Start.GG page </Button></a>
                </div>
            </div>
        </div>

    )
}