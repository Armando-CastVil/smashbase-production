import type { NextPage } from "next";
import Head from "next/head";
import Sidebar from "../globalComponents/Sidebar";
import featuredPic from "../assets/homePagePics/featured.png";
import article1 from "../assets/homePagePics/schustats1.png";
import article2 from "../assets/homePagePics/results.jpeg";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import globalStyles from "../styles/GlobalSeedingStyles.module.css";

const Home: NextPage = () => {
  return (
    <div className={globalStyles.body}>
      <Head>
        <title>SmashBase</title>
        <meta
          charSet="utf-8"
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/gvc4owm.css"
        ></link>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      <div className={globalStyles.container}>
        <Sidebar />

        <div className={globalStyles.content}>
          <div className={styles.gallery}>
            <Image
              className={styles.galleryImage}
              src={featuredPic}
              alt="open beta announcement"
            ></Image>
            <div className={styles.featuredBar}>
              <div>
                <p className={styles.featuredText}>
                  {" "}
                  NEW:{" "}
                  <span className={styles.featuredTournamentName}>
                    Schu Seeding Algo 2.0
                  </span>{" "}
                  <Link
                    className={styles.registerText}
                    href="https://bit.ly/smashbase-update"
                    target="_blank"
                  >
                    {" "}
                    Read the patch notes!
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.articleSection}>
            <div className={styles.articleRow}>
              <div className={styles.articleContainer}>
              <Image className={styles.articleThumb} src={article1} alt="article1">
              </Image>
              <Link
                    className={styles.articleName}
                    href="https://bit.ly/smashbase-update"
                    target="_blank"
                  >
                    Best Non-PR American Players 
                  </Link>
                  <span className={styles.articleDate}>
                    6.30.2023
                  </span>
            </div>
            
            </div>
            <div className={styles.articleRow}>
              <div className={styles.articleContainer}>
              <Image className={styles.articleThumb} src={article2} alt="article2">
              </Image>
              <Link
                    className={styles.articleName}
                    href="https://schustats.smashbase.gg/resultsBasedTierlist.html"
                    target="_blank"
                  >
                    Schu's Results Based Tierlist
                  </Link>
                  <span className={styles.articleDate}>
                    8.14.2023
                  </span>
            </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
