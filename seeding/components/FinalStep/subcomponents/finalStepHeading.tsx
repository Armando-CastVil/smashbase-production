import stepStyles from "../../../../styles/FinalStep.module.css";
import locationSep from "assets/seedingAppPics/locationseparation.png";
import setSep from "assets/seedingAppPics/setseparation.png";
import carpoolSep from "assets/seedingAppPics/carpoolseparation.png";
import Image from "next/image";
import { Carpool } from "../../../definitions/seedingTypes";

export interface Props
{
  
    numOfRegionalConflicts: number;
    numOfRematchConflicts: number;
    carpoolList:Carpool[];
}

export default function finalStepHeading({numOfRegionalConflicts, numOfRematchConflicts,carpoolList}:Props) {
  console.log(numOfRegionalConflicts,numOfRematchConflicts,carpoolList?.length)
  return (
    <div className={stepStyles.flexHeader}>
      <div className={stepStyles.heading}>
        <p>Check and submit seeding</p>
      </div>
      <div className={stepStyles.sepStatsContainer}>
        <div className={stepStyles.statContainer}>
          <p>
            {numOfRegionalConflicts}
          </p>
          <Image
            src={locationSep}
            className={stepStyles.sepStatIcon}
            alt="verified check mark"
          />
        </div>
        <div className={stepStyles.statContainer}>
          <p>
            {numOfRematchConflicts}
          </p>
          <Image
            src={setSep}
            className={stepStyles.sepStatIcon}
            alt="verified check mark"
          />
        </div>
        <div className={stepStyles.statContainer}>
        {carpoolList?
        <p>{carpoolList.length}</p>
        :<p>0</p>
        }
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
