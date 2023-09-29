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
          <p className={stepStyles.locStatP}>
            9
          </p>
          <Image
            src={locationSep}
            className={stepStyles.locStatIcon}
            alt="Location Separation"
          />
        </div>
        <div className={stepStyles.statContainer}>
          <p className={stepStyles.setStatP}>
            2
          </p>
          <Image
            src={setSep}
            className={stepStyles.setStatIcon}
            alt="Set Separation"
          />
        </div>
        <div className={stepStyles.statContainer}>
          <p className={stepStyles.carStatP}>
            3
          </p>
          <Image
            src={carpoolSep}
            className={stepStyles.carStatIcon}
            alt="Carpool Separation"
          />
        </div>
      </div>
    </div>
  );
}
