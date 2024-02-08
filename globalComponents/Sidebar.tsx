import React, { useState } from 'react'; // Import useState
import styles from '../styles/Sidebar.module.css';
import Image from 'next/image';
import logoWithCaption from '../assets/homePagePics/logowithcaption.png';
import homeIcon from '../assets/homePagePics/homeIcon.png';
import autoseederIcon from '../assets/homePagePics/autoseederIcon.png';
import playerrankingsIcon from '../assets/homePagePics/playerrankingsIcon.png';
import oddscheckerIcon from '../assets/homePagePics/oddscheckerIcon.png';
import subscribeIcon from '../assets/homePagePics/subscribeIcon.png';
import twitterIcon from '../assets/homePagePics/twitterIcon.png';
import discordIcon from '../assets/homePagePics/discordIcon.png';
import loginIcon from '../assets/homePagePics/loginIcon.png';
import emailIcon from '../assets/homePagePics/emailIcon.png';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Link from 'next/link';
import { auth } from './modules/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { StartGGLoginButton } from './StartGGLoginButton';

const provider = new GoogleAuthProvider();

export default function Sidebar() {





    return (
        <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Image className={styles.logoImage} src={logoWithCaption} alt="logo"></Image>
            </div>

            <div className={styles.menuContainer}>
                
                <div className={styles.optionsContainer}>
                <div className={styles.optionsGroup}>
                    <Link href="https://smashbase.gg" className={styles.option}>
                        <Image className={styles.optionIcon} src={homeIcon} alt="home icon"></Image>
                        <p className={styles.availableOption}>Home</p>
                    </Link>
                    </div>
                <div className={styles.optionsGroup}>
                    <Link href="/seeding" className={styles.option}>
                        <Image className={styles.optionIcon} src={autoseederIcon} alt="autoseeder icon"></Image>
                        <p className={styles.availableOption}>Autoseeder</p>
                    </Link>

                    <Link href="https://linktr.ee/smashbasegg" className={styles.option}>
                        <Image className={styles.optionIcon} src={subscribeIcon} alt="Subscribe icon"></Image>
                        <p className={styles.availableOption}>Seeding Pass</p>
                    </Link>
                    </div>

                    <div className={styles.optionsGroup}>
                    <div className={styles.option}>
                        <Image className={styles.optionIcon} src={playerrankingsIcon} alt="player rankings icon"></Image>
                        <p className={styles.unavailableOption}>Player Rankings</p>
                    </div>

                    <Link href="/oddsCalculator" className={styles.option}>
                        <div className={styles.option}>
                            <Image className={styles.optionIcon} src={oddscheckerIcon} alt="odds checker icon"></Image>
                            <p className={styles.unavailableOption}>Odds Checker</p>
                        </div>
                    </Link>
                    </div>

                    <div className={styles.optionsGroup}>
                    <Link href="https://discord.gg/3u8GFFd6Nh" className={styles.option} target="blank">
                        <Image className={styles.optionIcon} src={discordIcon} alt="SmashBase Discord"></Image>
                        <p className={styles.option}>Community Discord</p>
                    </Link>

                    <Link href="mailto:team@smashbase.gg" className={styles.option}>
                        <Image className={styles.optionIcon} src={emailIcon} alt="Email us"></Image>
                        <p className={styles.option}> Contact Us</p>
                    </Link>
                    </div>
                </div>
            </div>
        <StartGGLoginButton />
        </div>
    );
}
