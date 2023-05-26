import type { NextPage } from 'next'
import Head from 'next/head'
import Sidebar from '../globalComponents/Sidebar'

import openBetaAnnouncement from "../assets/homePagePics/openBetaAnnouncement.png"
import wavedashBanner from "../assets/homePagePics/Wavedash_2023.png"
import noise from "../assets/homePagePics/noise.png"
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import SignInOut from '../globalComponents/SignInOut'
import { useAuthState } from 'react-firebase-hooks/auth'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../seeding/utility/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from '../globalComponents/Header'
import Footer from '../globalComponents/Footer'
import { useEffect } from 'react'
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const Home: NextPage = () => {





  return (
    <div className={styles.body}>
      <Head>
        <title>SmashBase</title>
        <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      <div className={styles.container}>
        <Sidebar />

        <div className={styles.content}>
          <div className={styles.gallery}>

            <Image className={styles.galleryImage} src={wavedashBanner} alt="open beta announcement"></Image>
            <div className={styles.featuredBar}>
              <div>
                <p className={styles.featuredText}> //FEATURED: <span className={styles.featuredTournamentName}>Wavedash 2023</span> <Link className={styles.registerText} href="https://www.start.gg/tournament/wavedash-2023-1/register" target="_blank"> Register here today!</Link></p>  
              </div>

            </div>


          </div>
        </div>
      </div>








    </div >
  );
}

export default Home
