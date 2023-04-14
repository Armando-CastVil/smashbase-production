import React from 'react';
import styles from '../styles/Footer.module.css'



export default function Footer() {
    return (
        <footer className={styles.footerContainer}>

            <p className={styles.footerParragraph}>&copy; 2023 SmashBase </p>

            
            <nav>
                <ul className={styles.navList}>
                    <li className={styles.navLink}><a href="https://beta.smashbase.gg" target='blank'>Home</a></li>
                    <li className={styles.navLink}><a href="#">FAQs</a></li>
                    <li className={styles.navLink}><a href="#">About</a></li>
                    <li className={styles.navLink}><a href="https://discord.gg/3u8GFFd6Nh" target='blank'>Discord</a></li>
                    <li className={styles.navLink}><a href="https://twitter.com/Smashbasegg" target='blank'>Twitter</a></li>
                </ul>
            </nav>


        </footer>


    );
};

