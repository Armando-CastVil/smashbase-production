import type { NextPage } from 'next'
import Head from 'next/head'
import Sidebar from '../globalComponents/Sidebar'
import wavedashBanner from "../assets/homePagePics/Wavedash_2023.png"
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import globalStyles from '../styles/GlobalSeedingStyles.module.css'

const Home: NextPage = () => {





  return (
    <div className={globalStyles.body}>
      <Head>
        <title>SmashBase</title>
        <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="stylesheet" href="https://use.typekit.net/gvc4owm.css"></link>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      <div className={globalStyles.container}>
        <Sidebar />

        <div className={globalStyles.content}>
          <div className={styles.gallery}>

            <Image className={styles.galleryImage} src={wavedashBanner} alt="open beta announcement"></Image>
            <div className={styles.featuredBar}>
              <div>
                <p className={styles.featuredText}> FEATURED: <span className={styles.featuredTournamentName}>Wavedash 2023</span> <Link className={styles.registerText} href="https://www.start.gg/tournament/wavedash-2023-1/register" target="_blank"> Register here today!</Link></p>  
              </div>

            </div>


          </div>
        </div>
      </div>








    </div >
  );
}

export default Home
