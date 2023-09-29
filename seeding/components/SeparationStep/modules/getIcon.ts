import lowIcon from "../../../../assets/seedingAppPics/lowIcon.png"
import moderateIcon from "../../../../assets/seedingAppPics/moderateIcon.png"
import highIcon from "../../../../assets/seedingAppPics/highIcon.png"
import { StaticImageData } from "next/image";

export default function getIcon(setting:string) {
    let settingIconSrc: StaticImageData;
    settingIconSrc = lowIcon;
  
    switch (setting) {
      case "none":
        settingIconSrc = lowIcon;
        break;
      case "low":
        settingIconSrc = lowIcon;
        break;
      case "moderate":
        settingIconSrc = moderateIcon;
        break;
      case "high":
        settingIconSrc = highIcon;
        break;
      default:
        settingIconSrc = lowIcon;
    }
  
    return settingIconSrc;
  }