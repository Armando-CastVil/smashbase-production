// components/LoginButton.js
// OAuth configuration

import { useEffect, useState } from "react";
import styles from '../styles/Sidebar.module.css'
import startggLogo from '../assets/globalAssets/startgglogo.png'
import Image from 'next/image';
import defaultPicture from '../assets/seedingAppPics/logo.jpg'
import logoutIcon from '../assets/globalAssets/logouticon.png'
import Link from "next/link";
const CLIENT_ID = 51;
const REDIRECT_URI = "http://aerodusk.smashbase.gg/oauth";

export const StartGGLoginButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>();


    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        console.log(currentUser)

        if (currentUser) {
            const userObject = JSON.parse(currentUser);
            userObject.user.rating = Number(userObject.user.rating).toFixed(2); // Round the rating to 2 decimal places
            setUser(userObject);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginClick = () => {
        window.location.href = `http://start.gg/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&scope=user.identity%20user.email%20tournament.manager&redirect_uri=${REDIRECT_URI}`;
    };

    const handleLogoutClick = () => {
        // Remove currentUser from local storage and set isLoggedIn to false
        localStorage.removeItem('currentUser');
        setIsLoggedIn(false);
    };

    return (
        <div className={styles.startggContainer}>
            {isLoggedIn ? (

                <div className={styles.profileInfoContainer}>
                    <Image
                        alt="profile picture"
                        src={
                            user?.user.profilePicture == undefined
                                ? defaultPicture
                                : user?.user.profilePicture
                        }
                        width={42}
                        height={42}
                    ></Image>
                    <Link href="/user/[id]" as={`/user/${user.user.startGGID}`}>
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>{user?.user.userName}</p>
                            <p className={styles.rating}>{Number(user.user.rating).toFixed(2) + "PTS."}</p>
                        </div>
                    </Link>
                    <button onClick={handleLogoutClick}><Image src={logoutIcon} alt="logout icon" width={26} height={26}></Image></button>
                </div>
            ) : (
                <button className={styles.startggLoginButton} onClick={handleLoginClick}>
                    <Image className={styles.startggIcon} alt="start.gg logo" src={startggLogo}></Image>Login With StartGG
                </button>
            )}
        </div>

    )

};

