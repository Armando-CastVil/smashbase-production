import React from 'react';
import styles from '/styles/ErrorPage.module.css'
import errorLogo from "/assets/globalAssets/ErrorLogo.png"
import Image from 'next/image'
import Link from 'next/link';
const ErrorPage = () => {
  const discordChannelLink = 'https://discord.com/channels/1001574731046203433/1080685090180448266'; // Replace with the appropriate Discord channel link

  return (
    <div className={styles.body}>
     <Image  src={errorLogo} alt="error image"></Image>
     <h1 className={styles.errorHeading}>Something unexpected happened...</h1>
     <h2 className={styles.errorSubheading}>Please describe what you were doing so we can get to fixing the problem :(</h2>
     <div> <p className={styles.text}>You can find instructions on how to submit your report <Link href="https://discord.com/channels/1001574731046203433/1080683323136933898" className={styles.link}>here</Link></p></div>
    <div className={styles.homeContainer}><Link href="https://smashbase.gg" className={styles.link}> Back to Home</Link></div>
    </div>
  );
};

export default ErrorPage;