import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/SeedingOutro.module.css";
import Button from "@atlaskit/button/standard-button";
import TOPicture from "assets/seedingAppPics/TOPicture.jpg";
import verifiedCheckMark from "assets/seedingAppPics/verified.png";
import Image from "next/image";
import Link from "next/link";
import Competitor from "../classes/Competitor";
interface props {
  slug: string | undefined;
  startTime: number | undefined;
  endTime: number | undefined;
  playerList: Competitor[];
}
export default function SeedingOutro({
  slug,
  startTime,
  endTime,
  playerList,
}: props) {
  let tourneyPage: string = "https://start.gg/" + slug;
  let elapsedTime = endTime! - startTime!;

  const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const seconds = Math.floor((elapsedTime / 1000) % 60);

  const hoursStr =
    hours !== 0
      ? `${hours.toString().replace(/^0+/, "")} hour${hours !== 1 ? "s" : ""} `
      : "";
  const minutesStr =
    minutes !== 0
      ? `${minutes.toString().replace(/^0+/, "")} minute${
          minutes !== 1 ? "s" : ""
        } `
      : "";
  const secondsStr =
    seconds !== 0
      ? `${seconds.toString().replace(/^0+/, "")} second${
          seconds !== 1 ? "s" : ""
        }`
      : "";

  const andStr = minutes !== 0 ? "and " : "";

  const timeStr = `${playerList.length} players seeded in ${hoursStr}${minutesStr}${andStr}${secondsStr}.`;

  return (
    
      <div className={globalStyles.content}>
        <div className={stepStyles.outroContent}>
        <Image
          src={verifiedCheckMark}
          className={stepStyles.verifiedPicture}
          alt="verified check mark"
        />
        <div className={stepStyles.heading}>Seeding Complete!</div>
        <div className={stepStyles.flexRow}>
          <Image
            className={stepStyles.picture}
            src={TOPicture}
            alt="Image of a TO"
          />
          <div className={stepStyles.textContainer}>
            <p className={stepStyles.outroParagraph}>
              We&apos;re always looking to improve our product and make it the
              best it can be for our community. That&apos;s why we value your
              feedback! Whether it&apos;s a suggestion, bug report, or just
              general thoughts on the product, we&apos;d love to hear from you.
              You can reach us through our our email at{" "}
              <a href="mailto:smashbaseproject@gmail.com">
                smashbaseproject@gmail.com
              </a>{" "}
              or our socials at{" "}
              <Link href="https://twitter.com/Smashbasegg" target="blank">
                Twitter{" "}
              </Link>{" "}
              and{" "}
              <Link href="https://discord.gg/3u8GFFd6Nh" target="blank">
                Discord{" "}
              </Link>
              .
            </p>
          </div>
        </div>
        <p className={stepStyles.time}>{timeStr}</p>
        <div className={globalStyles.seedingFooterContainer}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "5%",
              height: "100%",
            }}
          >
            <a href="https://beta.smashbase.gg">
              <Button appearance="primary"> Return to Home </Button>
            </a>
            <a href={tourneyPage} target="_blank">
              <Button appearance="primary"> Go to Start.GG page </Button>
            </a>
          </div>
        </div>
      </div>
      </div>
      
  );
}
