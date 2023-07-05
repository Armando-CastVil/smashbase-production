import stepStyles from "/styles/SeparationStep.module.css";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import LoadingScreen from "./LoadingScreen";
import { useState } from "react";
import SeedingFooter from "./SeedingFooter";
import Competitor from "../classes/Competitor";
import InfoIcon from "@atlaskit/icon/glyph/info";
import LikeIcon from "@atlaskit/icon/glyph/like";
import Image, { StaticImageData } from "next/image";
import lowIcon from "/assets/seedingAppPics/lowIcon.png";
import moderateIcon from "/assets/seedingAppPics/moderateIcon.png";
import highIcon from "/assets/seedingAppPics/highIcon.png";
import CarpoolStep from "./CarpoolStep";
import getSeparationVer2 from "../modules/getSeparationVer2";
import buildSeparationMap from "../modules/buildSeparationMap";
import { Carpool } from "../seedingTypes";
import stringToValueHistoration from "../modules/stringToValueHistoration";
import stringToValueLocation from "../modules/stringToValueLocation";
import stringToValueConservativity from "../modules/stringToValueConservativity";
import writeToFirebase from "../modules/writeToFirebase";
import { getAuth } from "firebase/auth";
import InlineMessage from "@atlaskit/inline-message";
import Sidebar from "../../globalComponents/Sidebar";
const auth = getAuth();
interface phaseGroupDataInterface {
  phaseIDs: number[];
  phaseIDMap: Map<number, number[]>;
  seedIDMap: Map<number | string, number>;
  sets: any[];
}
interface props {
  page: number;
  setPage: (page: number) => void;
  apiKey: string | undefined;
  playerList: Competitor[];
  setPlayerList: (competitors: Competitor[]) => void;
  phaseGroupData: phaseGroupDataInterface | undefined;
  slug: string | undefined;
}
export default function SeparationStep({
  page,
  setPage,
  apiKey,
  playerList,
  setPlayerList,
  phaseGroupData,
  slug,
}: props) {
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);
  const [showCarpoolPage, setShowCarpoolPage] = useState<boolean>(false);
  const [numTopStaticSeeds, setNumTopStaticSeeds] = useState(1);
  const [conservativity, setConservativity] = useState("moderate");
  const [location, setLocation] = useState("moderate");
  const [historation, setHistoration] = useState("moderate");
  const [carpoolList, setCarpoolList] = useState<Carpool[]>([]);

  //this step's submit function calls the separation function and updates the player list
  async function handleNextSubmit() {
    setIsNextPageLoading(true);
    assignSeedIDs(playerList, phaseGroupData);
    setPlayerList(
      getSeparationVer2(
        playerList,
        await buildSeparationMap(
          playerList,
          carpoolList,
          stringToValueHistoration(historation),
          stringToValueLocation(location)
        ),
        numTopStaticSeeds,
        stringToValueConservativity(conservativity)
      )
    );
    setIsNextPageLoading(false);

    // data collection
    let miniSlug = slug!
      .replace("/event/", "__")
      .substring("tournament/".length);
    writeToFirebase(
      "/usageData/" +
        auth.currentUser!.uid +
        "/" +
        miniSlug +
        "/numTopStaticSeeds",
      numTopStaticSeeds
    );
    writeToFirebase(
      "/usageData/" +
        auth.currentUser!.uid +
        "/" +
        miniSlug +
        "/separationConservativity",
      conservativity
    );
    writeToFirebase(
      "/usageData/" +
        auth.currentUser!.uid +
        "/" +
        miniSlug +
        "/locationSeparation",
      location
    );
    writeToFirebase(
      "/usageData/" +
        auth.currentUser!.uid +
        "/" +
        miniSlug +
        "/historySeparation",
      historation
    );

    setPage(page + 1);
  }
  const preventRefresh = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  let conservativityIconSrc: StaticImageData;

  switch (conservativity) {
    case "none":
      conservativityIconSrc = lowIcon;
      break;
    case "low":
      conservativityIconSrc = lowIcon;
      break;
    case "moderate":
      conservativityIconSrc = moderateIcon;
      break;
    case "high":
      conservativityIconSrc = highIcon;
      break;
    default:
      conservativityIconSrc = lowIcon;
  }

  let locationIconSrc: StaticImageData;

  switch (location) {
    case "none":
      locationIconSrc = lowIcon;
      break;
    case "low":
      locationIconSrc = lowIcon;
      break;
    case "moderate":
      locationIconSrc = moderateIcon;
      break;
    case "high":
      locationIconSrc = highIcon;
      break;
    default:
      locationIconSrc = lowIcon;
  }

  let historyIconSrc: StaticImageData;

  switch (historation) {
    case "none":
      historyIconSrc = lowIcon;
      break;
    case "low":
      historyIconSrc = lowIcon;
      break;
    case "moderate":
      historyIconSrc = moderateIcon;
      break;
    case "high":
      historyIconSrc = highIcon;
      break;
    default:
      historyIconSrc = lowIcon;
  }

  const handleClick = () => {
    setShowCarpoolPage(true);
  };

  //check to see if the first player's projected path does not exist, if it doesn't then the bracket is private
  let isBracketPrivate: boolean = false;
  if (playerList.length != 0 && playerList[0].projectedPath.length == 0) {
    isBracketPrivate = true;
  }

  return (
    <div>
      <LoadingScreen
        message="Separating players based on your input. The process might take a few seconds up to a couple minutes depending on the number of entrants."
        isVisible={isNextPageLoading}
      />
      {showCarpoolPage ? (
        <CarpoolStep
          key="SeparationStep"
          page={page}
          // setPage={setPage}
          apiKey={apiKey}
          playerList={playerList}
          setPlayerList={setPlayerList}
          phaseGroupData={phaseGroupData}
          setShowCarpoolPage={setShowCarpoolPage}
          carpoolList={carpoolList}
          setCarpoolList={setCarpoolList}
          setPage={setPage}
        />
      ) : (
        <div>
          <div className={globalStyles.body}>
            <div className={globalStyles.container}>
            <Sidebar />
            <div className={globalStyles.content}>
              <div className={stepStyles.flexHeader}>
                <div className={globalStyles.heading}>
                  <p>Separate players by carpool / Adjust settings</p>
                </div>
                <button className={stepStyles.button} onClick={handleClick}>
                  Handle carpools
                </button>
              </div>
              <div className={stepStyles.settingsMainContainer}>
              <div className={stepStyles.settingHeadText}>
                <p>Advanced Separation Settings</p>
              </div>

          
              <div className={stepStyles.formContainer}>
                <form onSubmit={preventRefresh}>
                  <div className={stepStyles.settingsRow}>
                    <div className={stepStyles.conservativityContainer}>
                      <div className={stepStyles.menuContainer}>
                        <div className={stepStyles.iconContainer}>
                          <Image
                            src={conservativityIconSrc}
                            alt="low icon"
                            width={20}
                            height={20}
                          />
                        </div>
                        <select
                          className={stepStyles.menuSelect}
                          id="separation"
                          value={conservativity}
                          onChange={(e) => setConservativity(e.target.value)}
                        >
                          <option value="low" className={stepStyles.menuOption}>
                            Low
                          </option>
                          <option
                            value="moderate"
                            className={stepStyles.menuOption}
                          >
                            Moderate
                          </option>
                          <option
                            value="high"
                            className={stepStyles.menuOption}
                          >
                            High
                          </option>
                        </select>
                      </div>

                      <div className={stepStyles.infoContainer}>
                        <p>Separation Strictness</p>
                        <div className={stepStyles.infoText}>
                          <InlineMessage appearance="info">
                            <p className={stepStyles.infoText}>
                              Strictness determines how much the separation
                              process adjusts players&apos; positions to avoid
                              unfavorable matchups. Increasing the strictness
                              keeps players closer to their initial seed, while
                              decreasing it allows for more movement and
                              separation among players.
                            </p>
                          </InlineMessage>
                        </div>
                      </div>
                    </div>

                    <div className={stepStyles.conservativityContainer}>
                      <div className={stepStyles.menuContainer}>
                        <div className={stepStyles.iconContainer}>
                          <Image
                            src={locationIconSrc}
                            alt="low icon"
                            width={20}
                            height={20}
                          />
                        </div>
                        <select
                          className={stepStyles.menuSelect}
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        >
                          <option value="low" className={stepStyles.menuOption}>
                            Low
                          </option>
                          <option
                            value="moderate"
                            className={stepStyles.menuOption}
                          >
                            Moderate
                          </option>
                          <option
                            value="high"
                            className={stepStyles.menuOption}
                          >
                            High
                          </option>
                        </select>
                      </div>

                      <div className={stepStyles.infoContainer}>
                        <p>Same Region Separation</p>
                        <div className={stepStyles.infoText}>
                          <InlineMessage appearance="info">
                            <p className={stepStyles.infoText}>
                              This setting determines how much priority to give
                              to location when separating.
                            </p>
                          </InlineMessage>
                        </div>
                      </div>
                    </div>

                    <div className={stepStyles.conservativityContainer}>
                      <div className={stepStyles.menuContainer}>
                        <div className={stepStyles.iconContainer}>
                          <Image
                            src={historyIconSrc}
                            alt="low icon"
                            width={20}
                            height={20}
                          />
                        </div>
                        <select
                          className={stepStyles.menuSelect}
                          id="historation"
                          value={historation}
                          onChange={(e) => setHistoration(e.target.value)}
                        >
                          <option value="low" className={stepStyles.menuOption}>
                            Low
                          </option>
                          <option
                            value="moderate"
                            className={stepStyles.menuOption}
                          >
                            Moderate
                          </option>
                          <option
                            value="high"
                            className={stepStyles.menuOption}
                          >
                            High
                          </option>
                        </select>
                      </div>

                      <div className={stepStyles.infoContainer}>
                        <p>Recently Played Separation</p>
                        <div className={stepStyles.infoText}>
                          <InlineMessage appearance="info">
                            <p className={stepStyles.infoText}>
                              This setting determines how much priority to give
                              to set history between two players when
                              separating.
                            </p>
                          </InlineMessage>
                        </div>
                      </div>

                    </div>
                    
                  </div>
                  <div className={stepStyles.staticSeedsForm}>
                    <span
                      className={stepStyles.whiteText}
                    >{`Top ${numTopStaticSeeds} players will not be moved`}</span>
                    <input
                      className={stepStyles.staticSeedsFormInput}
                      type="number"
                      id="selectedPlayers"
                      min="1"
                      max={playerList.length}
                      value={numTopStaticSeeds}
                      onChange={(e) =>
                        setNumTopStaticSeeds(parseInt(e.target.value))
                      }
                    />
                    <div className={stepStyles.infoContainer}>
                     <label htmlFor="selectedPlayers">
                        <p className={stepStyles.whiteText}>
                          Enable Static Seeds
                        </p>
                      </label>
                      <div className={stepStyles.infoText}>
                        <InlineMessage appearance="info">
                          <p className={stepStyles.infoText}>
                            This sets the number of players that you want to
                            make static. For example setting 8 would make sure
                            that the top 8 seeded players are not moved during
                            the separation process.
                          </p>
                        </InlineMessage>
                      </div>
                      </div>
                  </div>
                </form>
                </div>
              </div>

              <div className={globalStyles.seedingFooterContainer}>
                <SeedingFooter
                  page={page}
                  setPage={setPage}
                  handleSubmit={handleNextSubmit}
                ></SeedingFooter>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function assignSeedIDs(
  playerList: Competitor[],
  phaseGroupData: phaseGroupDataInterface | undefined
) {
  for (let i = 0; i < playerList.length; i++) {
    playerList[i].seedID = phaseGroupData!.seedIDMap.get(
      playerList[i].smashggID
    );
  }
}
