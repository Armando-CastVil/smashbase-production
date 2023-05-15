import type { NextPage } from 'next'
import Head from 'next/head'
import backgroundLogo from "/assets/homePagePics/backgroundLogo.png"
import ladderPic from "/assets/homePagePics/ladder.png"
import sblogo from "../assets/homePagePics/VectorLogo.png"
import trophy from "../assets/homePagePics/trophy.png"
import sprout from "../assets/homePagePics/sprout.png"
import backgroundShape from "../assets/homePagePics/Shape.png"
import orb from "../assets/homePagePics/Orb.png"
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

const Home: NextPage = () => {

  



  return (
    <div className={styles.body}>
      <Head>
        <title>SmashBase</title>
        <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>

      <Header backgroundColor='#1E293B' />



      <div className={styles.main}>
        <div className={styles.column1}>
          <div className={styles.infoContainer}>
            <h1 className={styles.heading}>Welcome to Smashbase Beta</h1>
            <p className={styles.blurb}> Below you&apos;ll see a list of tools that we&apos;re currently developing, along with what version they are currently on.</p>
          </div>
          <div className={styles.menu}>
            <div className={styles.menuItem}>
              <Link href="/seeding" style={{ textDecoration: 'none' }}>
                <Image src={sprout} alt="Image of a sprout" />


                <h3 className={styles.menuItemName}>Seeding</h3>
                <p className={styles.menuItemDescription}>Give your tournament hyper-accurate, conflict-free seeding — lightning fast.</p>
              </Link>
            </div>

            <div className={styles.menuItem}>

              <Image src={ladderPic} alt="Image of a ladder" />
              <h3 className={styles.menuItemName}>SmashBase Ranking Ladder</h3>
              <p className={styles.menuItemDescription}>Check out where you&apos;re ranked according to our hyper-accurate Schu Algorithm Rankings!</p>


            </div>
            <div className={styles.menuItem}>
              <Image src={trophy} alt="Image of a trophy" />
              <h3 className={styles.menuItemName}>Tourney Locator</h3>
              <p className={styles.menuItemDescription}>Locate tournaments near you.</p>
            </div>
          </div>



        </div>
        <div className={styles.column2}>
          <div className={styles.imageContainer}>
            <Image src={backgroundLogo} alt='logo in background' className={styles.backgroundLogo} width={313} height={400} />
            <Image src={orb} alt='yellow orb' className={styles.yellowCircle} width={96} height={96} />
            <Image src={backgroundShape} alt='shape in background' className={styles.backgroundShape} width={288} height={350} />
          </div>

        </div>


      </div>
      <Footer />
    </div>
  );
}

export default Home
