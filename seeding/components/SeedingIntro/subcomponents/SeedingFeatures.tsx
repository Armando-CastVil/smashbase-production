import introStyles from "../../../../styles/Intro.module.css"
import * as introImports from "../modules/SeedingIntroIndex"
import Image from "next/image";
const SeedingFeatures = () => (
    <div className={introStyles.featuresContainer}>
        <div className={introStyles.featuresCaption}>
            <p>
                This tool automatically accurately seeds your tournament while
                accounting for:
            </p>
        </div>
        <div className={introStyles.features}>
            <div className={introStyles.featureLabel}>
                <p>Location</p>
                <Image
                    className={introStyles.checkmark}
                    src={introImports.checkmark}
                    alt="image of a checkmark"
                ></Image>
            </div>
            <div className={introStyles.featureLabel}>
                <p>Play History</p>
                <Image
                    className={introStyles.checkmark}
                    src={introImports.checkmark}
                    alt="image of a checkmark"
                ></Image>
            </div>
            <div className={introStyles.featureLabel}>
                <p>Results</p>
                <Image
                    className={introStyles.checkmark}
                    src={introImports.checkmark}
                    alt="image of a checkmark"
                ></Image>
            </div>
        </div>
        <div className={introStyles.featuresCaption}>
            <p>
                You can manually adjust parameters to make sure the seeding is to
                your liking.
            </p>
        </div>
    </div>

);
export default SeedingFeatures