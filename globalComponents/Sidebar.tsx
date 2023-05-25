import styles from '../styles/Sidebar.module.css'
import Image from 'next/image'
import logoWithCaption from "../assets/homePagePics/logowithcaption.png"
import homeIcon from "../assets/homePagePics/homeIcon.png"
import autoseederIcon from "../assets/homePagePics/autoseederIcon.png"
import playerrankingsIcon from "../assets/homePagePics/playerrankingsIcon.png"
import oddscheckerIcon from "../assets/homePagePics/oddscheckerIcon.png"
import subscribeIcon from "../assets/homePagePics/subscribeIcon.png"
import twitterIcon from "../assets/homePagePics/twitterIcon.png"
import discordIcon from "../assets/homePagePics/discordIcon.png"
import loginIcon from "../assets/homePagePics/loginIcon.png"
import emailIcon from "../assets/homePagePics/emailIcon.png"
import { GoogleAuthProvider, getAuth, signInWithRedirect } from "firebase/auth";
import Link from 'next/link'
import { firebaseConfig } from '../seeding/utility/firebaseConfig'
import { initializeApp } from 'firebase/app'
import { useAuthState } from 'react-firebase-hooks/auth'

const provider = new GoogleAuthProvider();
//Initialize Firebase stuff
export const app = initializeApp(firebaseConfig);
const auth = getAuth();


export default function Sidebar() {
    const [authState] = useAuthState(auth);

    const logIn = async () => {
        await signInWithRedirect(auth, provider);
    }
    const logOut = async () => {
        await auth.signOut();
    }
    return (
        <div className={styles.sidebar}>

            <div className={styles.logoContainer}>
                <Image className={styles.logoImage} src={logoWithCaption} alt='logo'></Image>
            </div>


            <Link href="https://smashbase.gg" className={styles.homeOption}>
                <Image className={styles.homeIcon} src={homeIcon} alt='home icon'></Image><p>Home</p>
            </Link>


            <div className={styles.optionsContainer}>
                
                    <Link href="/seeding" className={styles.option}>
                        <Image className={styles.optionIcon} src={autoseederIcon} alt='autoseeder icon'></Image><p className={styles.availableOption} >Autoseeder</p>
                    </Link>
                

                <div className={styles.upcomingFeatures} title="Coming Soon">
                    <div className={styles.comingSoonOption}>
                        <Image className={styles.optionIcon} src={playerrankingsIcon} alt='player rankings icon'></Image><p className={styles.unavailableOption}>Player Rankings</p>
                    </div>

                    <div className={styles.comingSoonOption}>
                        <Image className={styles.optionIcon} src={oddscheckerIcon} alt='odds checker icon'></Image><p className={styles.unavailableOption}>Sidebet Calculator</p>
                    </div>

                </div>

            </div>

            <div className={styles.optionsContainer}>
                <div className={styles.optionalOption}>
                    <Image className={styles.optionIcon} src={subscribeIcon} alt='Subscribe icon'></Image><p className={styles.subscribe}>Subscribe</p>
                </div>

                <div className={styles.availableOptionalOption} onClick={authState ? logOut : logIn}>
                    <Image className={styles.optionIcon} src={loginIcon} alt="Log in icon" />
                    <p>{authState ? "Logout" : "Login"}</p>
                </div>
            </div>

            <div className={styles.socialMediaOptions}>
                <Link href="https://twitter.com/Smashbasegg" target='blank'><Image className={styles.optionIcon} src={twitterIcon} alt='our twitter'></Image></Link>
                <a href="mailto:smashbaseproject@gmail.com"><Image className={styles.optionIcon} src={emailIcon} alt='email us'></Image></a>
                <Link href="https://discord.gg/3u8GFFd6Nh" target='blank'><Image className={styles.optionIcon} src={discordIcon} alt="our discord"></Image></Link>
            </div>





        </div>
    )
}