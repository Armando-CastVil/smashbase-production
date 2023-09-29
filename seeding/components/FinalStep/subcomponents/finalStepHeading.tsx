import stepStyles from "../../../../styles/FinalStep.module.css";
import locationSep from "assets/seedingAppPics/locationseparation.png";
import setSep from "assets/seedingAppPics/setseparation.png";
import carpoolSep from "assets/seedingAppPics/carpoolseparation.png";
import Image from "next/image";

export default function finalStepHeading() {
  return (
    <div className={stepStyles.flexHeader}>
      <div className={stepStyles.heading}>
        <p>Check and submit seeding</p>
      </div>
      <div className={stepStyles.sepStatsContainer}>
        <div className={stepStyles.statContainer}>
          <p>
            9
          </p>
          <Image
            src={locationSep}
            className={stepStyles.sepStatIcon}
            alt="verified check mark"
          />
        </div>
        <div className={stepStyles.statContainer}>
          <p>
            2
          </p>
          <Image
            src={setSep}
            className={stepStyles.sepStatIcon}
            alt="verified check mark"
          />
        </div>
        <div className={stepStyles.statContainer}>
          <p>
            3
          </p>
          <Image
            src={carpoolSep}
            className={stepStyles.sepStatIcon}
            alt="verified check mark"
          />
        </div>
      </div>
    </div>
  );
}
