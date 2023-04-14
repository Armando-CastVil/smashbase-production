import styles from '/styles/onboarding.module.css'
import SeedingFooter from './SeedingFooter'
import Image from 'next/image';
import TOPicture from "assets/seedingAppPics/TOPicture.jpg"
import Link from 'next/link';
import { useEffect, useState } from 'react';

//props passed from previous step
interface props {
  page: number;
  setPage: (page: number) => void;

}
//onboarding page for seeding app
export default function SeedingIntro({ page, setPage }: props) {

  const [showNotification, setShowNotification] = useState(false);

  




  function handleSubmit() {
    
    setPage(page + 1)
  }
  return (
    <div className={styles.onboardingMain}>
      <div className={styles.onboardingContainer}>
        <div className={styles.onboardingLeft}>
          <div className={styles.onboardingHeading}>
            <h1>Welcome to SmashBase Autoseeder!</h1>
            <p>Smash seeding done&nbsp;<i> excellent. </i></p>
          </div>

          <button onClick={handleSubmit} className={styles.getStartedButton}>Get Started</button>
        </div>
        <div className={styles.onboardingRight}>
          <Image className={styles.picture} src={TOPicture} alt="Image of a TO" />
          <p>
            We're always looking to improve our product and make it the best it can be for our community.
            That's why we value your feedback! Whether it's a suggestion, bug report, or just general thoughts on the product, we'd love to hear from you.
            You can reach us through our our email at <a className={styles.onboardingLink} href="mailto:smashbaseproject@gmail.com">smashbaseproject@gmail.com</a> or our socials at <Link className={styles.onboardingLink} href="https://twitter.com/Smashbasegg" target='blank' >Twitter </Link> and <Link className={styles.onboardingLink} href="https://discord.gg/3u8GFFd6Nh" target='blank' >Discord </Link>.
          </p>

        </div>
      </div>
      <div>
     
      </div>
    </div>



  )
}