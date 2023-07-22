//This file imports and exports all the necessary pieces at once 
//in order to avoid having a big list of import statements at the top of components

//components
import SeedingIntroHeading from "../subcomponents/seedingIntroHeading";
export {SeedingIntroHeading}

import SeedingFeatures from "../subcomponents/SeedingFeatures";
export {SeedingFeatures}

import BottomCaption from "../subcomponents/BottomCaption";
export {BottomCaption}
//assets
import checkmark from "assets/seedingAppPics/checkmark.png";
export {checkmark}

//interfaces
import SeedingIntroProps from "./seedingIntroProps";
export default SeedingIntroProps