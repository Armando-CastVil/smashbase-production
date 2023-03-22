import type { NextPage } from 'next'
import Head from 'next/head'
import ladderPic from "/assets/homePagePics/ladder.png"
import sblogo from "../assets/homePagePics/VectorLogo.png"
import trophy from "../assets/homePagePics/trophy.png"
import sprout from "../assets/homePagePics/sprout.png"
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import SignInOut from '../seeding/components/SignInOut'
import { useAuthState } from 'react-firebase-hooks/auth'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../seeding/utility/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//props for auth state
interface authProps {
  auth:any
  authState:any
}

//Initialize Firebase stuff
export const app = initializeApp(firebaseConfig);
const auth = getAuth();
const Home: NextPage = () => {
  const [authState] = useAuthState(auth);
  return (
    <div className={styles.main}>
      <Head>
        <title>SmashBase</title>
        <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossOrigin="anonymous"></link>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
   
    <div>
  
    <div className="container">
        <div className="container">
            <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
              <Link href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap"/></svg>
              </Link>
              <div>
                <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                  <li><a href="#" className="nav-link px-2">Home</a></li>
                  <li><a href="#" className="nav-link px-2">FAQs</a></li>
                  <li><a href="#" className="nav-link px-2">About</a></li>
                </ul>
              </div>
             
        
              <div className="col-md-3 text-end">
              <SignInOut auth={auth} authState={authState}/>
              </div>
            </header>
          </div>
        
        <div className="container col-xxl-8 px-4 py-5">
            <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
              <div className="col-10 col-sm-8 col-lg-6">
                <Image src={sblogo} alt="SmashBase logo" className="d-block mx-lg-auto img-fluid" loading="lazy"></Image>
              </div>
              <div className="col-lg-6">
                <h1 className="display-5 fw-bold lh-1 mb-3 text-light">Welcome to Smashbase Beta</h1>
                <p className="lead text-white"> Below you&apos;ll see a list of tools that we&apos;re currently developing, along with what version they are currently on.
                </p>
              </div>
            </div>
          </div>
        
        
        
        <div className="list-group w-auto">
            <div className="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
              <Image src={sprout} alt="sprout thumbnail" width="32" height="32" className="rounded-circle flex-shrink-0"></Image>
              <div className="d-flex gap-2 w-100 justify-content-between">
                <Link href="/seeding">
                <div>
                  
                  <h6 className="mb-0">SmashBase Seeding Tool</h6>
                  <p className="mb-0 opacity-75">Give your tournament hyper-accurate, conflict-free seeding — lightning fast.</p>
                
                </div>
                </Link>
                <small className="opacity-50 text-nowrap">BETA 1.1</small>
              </div>
            </div>
            <div className="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
              <Image src={trophy} alt="trophy thumbnail" width="32" height="32" className="rounded-circle flex-shrink-0"></Image>
              <div className="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 className="mb-0">Tourney Locator</h6>
                  <p className="mb-0 opacity-75">Locate tournaments near you.</p>
                </div>
                <small className="opacity-50 text-nowrap">UNRELEASED</small>
              </div>
            </div>
            <div className="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
              <Image src={ladderPic} alt="twbs" width="32" height="32" className="rounded-circle flex-shrink-0"></Image>
              <div className="d-flex gap-2 w-100 justify-content-between">
                <div>
                  <h6 className="mb-0">SmashBase Ranking Ladder</h6>
                  <p className="mb-0 opacity-75">Check out where you&apos;re ranked according to our hyper-accurate Schu Algorithm Rankings!</p>
                </div>
                <small className="opacity-50 text-nowrap">UNRELEASED</small>
              </div>
            </div>

            <div className="container">
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                  <p className="col-md-4 mb-0 text-white">&copy; 2023 SmashBase </p>
              
                  <Link href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                    <svg className="bi me-2" width="40" height="32"><use xlinkHref="#bootstrap"/></svg>
                  </Link>
              
                  <ul className="nav col-md-4 justify-content-end">
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-light">Home</a></li>
                    
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-light">FAQs</a></li>
                    <li className="nav-item"><a href="#" className="nav-link px-2 text-light">About</a></li>
                  </ul>
                </footer>
              </div>
          </div>
          </div>
      </div>
  </div>   
      
  )
}

export default Home
