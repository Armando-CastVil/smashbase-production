// components/LoginButton.js
// OAuth configuration

import { useEffect, useState } from "react";
import styles from '../styles/Sidebar.module.css'
import startggLogo from '../assets/globalAssets/startgglogo.png'
import Image from 'next/image';
const CLIENT_ID = 51;
const REDIRECT_URI = "https://aerodusk.smashbase.gg/oauth";

export const StartGGLoginButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>();


    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');

        if (currentUser) {
            const userObject = JSON.parse(currentUser);
            userObject.user.rating = Number(userObject.user.rating).toFixed(2); // Round the rating to 2 decimal places
            setUser(userObject);
            setIsLoggedIn(true);
        }
    }, []);

    const handleLoginClick = () => {
        window.location.href = `http://start.gg/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&scope=user.identity%20user.email&redirect_uri=${REDIRECT_URI}`;
    };

    const handleLogoutClick = () => {
        // Remove currentUser from local storage and set isLoggedIn to false
        localStorage.removeItem('currentUser');
        setIsLoggedIn(false);
    };

    return (
        <div className={styles.startggContainer}>
            {isLoggedIn ? (
                <div>
                    <div>
                        <p className={styles.userName}>{user?.user.userName}</p>
                    </div>
                    <div>
                        <p className={styles.rating}>{Number(user.user.rating).toFixed(2)}</p>
                    </div>
                    <button onClick={handleLogoutClick}>Logout</button>
                </div>
            ) : (

                <button onClick={handleLoginClick}><Image className={styles.startggIcon} alt="start.gg logo" src={startggLogo}></Image>Login With StartGG</button>
            )}
        </div>
    );
};

