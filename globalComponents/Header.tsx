import React from 'react';
import styles from '../styles/Header.module.css'
import sblogo from "../assets/homePagePics/VectorLogo.png"
import Image from 'next/image'
import Link from 'next/link';
import SignInOut from './SignInOut';
import { useAuthState } from 'react-firebase-hooks/auth'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../seeding/utility/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
//props for auth state
interface authProps {
    auth: any
    authState: any
}
interface props
{
    backgroundColor?: string;
    gradientStart?: string;
    gradientEnd?: string;
    
}
//Initialize Firebase stuff
export const app = initializeApp(firebaseConfig);
const auth = getAuth();

//start of function component
export default function Header({backgroundColor,gradientStart,gradientEnd}:props) {
    const [authState] = useAuthState(auth);

    const headerStyle = {
        backgroundColor: backgroundColor ?? "#ffffff",
        backgroundImage: gradientStart && gradientEnd && `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
      };
    

    return (
        
        
        <div>
             <header className={styles.header} style={headerStyle}>
                <div className={styles.logoContainer}>
                    <Image className={styles.logoImage} src={sblogo} alt='logo'></Image>
                    <p className={styles.logo}>Smashbase.gg</p>
                </div>


                <ul className={styles.navList}>
                    <li><a style={{ textDecoration: 'none' }} href="https://beta.smashbase.gg" target='blank' >Home</a></li>
                    <li><a style={{ textDecoration: 'none' }} href="https://beta.smashbase.gg" target='blank'>FAQs</a></li>
                    <li><a style={{ textDecoration: 'none' }} href="https://beta.smashbase.gg" target='blank'>About</a></li>
                </ul>
                <div className={styles.logInButton}>
                    <SignInOut auth={auth} authState={authState} />
                </div>
                
            </header>
            

        </div>
           
            
       

    );
};

