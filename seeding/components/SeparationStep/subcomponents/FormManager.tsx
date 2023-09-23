import InlineMessage from "@atlaskit/inline-message";
import stepStyles from "../../../../styles/SeparationStep.module.css"
import * as imports from "../modules/separationStepIndex"
import Image from "next/image"
import { Player } from "../../../definitions/seedingTypes";
interface props {
    conservativity: string;
    setConservativity: (conservativity: string) => void;
    location: string;
    setLocation: (location: string) => void;
    historation: string;
    setHistoration: (historation: string) => void;
    numTopStaticSeeds: number;
    setNumTopStaticSeeds: (numTopStaticSeeds: number) => void;
    preavoidancePlayerList: Player[];


}
export default function FormManager({ conservativity, setConservativity, location, setLocation, historation, setHistoration, numTopStaticSeeds, setNumTopStaticSeeds, preavoidancePlayerList }: props) {
    const preventRefresh = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };
    return (
        <div className={stepStyles.formContainer}>
            <form onSubmit={preventRefresh}>
                <div className={stepStyles.settingsRow}>
                    <div className={stepStyles.conservativityContainer}>
                        <div className={stepStyles.menuContainer}>
                            <div className={stepStyles.iconContainer}>
                                <Image
                                    src={imports.getIcon(conservativity)}
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

                                <option value="moderate" className={stepStyles.menuOption}>
                                    Moderate
                                </option>
                                <option value="high"className={stepStyles.menuOption}>
                                    High
                                </option>
                            </select>
                        </div>

                        <div className={stepStyles.infoContainer}>
                            <p>Avoidance Seeding Strictness</p>
                            <div className={stepStyles.infoText}>
                                <InlineMessage appearance="info">
                                    <p className={stepStyles.infoText}>
                                        Strictness determines how much the avoidance seeding
                                        process adjusts players&apos; positions to avoid
                                        unfavorable matchups. Increasing the strictness
                                        keeps players closer to their initial seed, while
                                        decreasing it allows for more movement to
                                        avoid undesirable matchups.
                                    </p>
                                </InlineMessage>
                            </div>
                        </div>
                    </div>

                    <div className={stepStyles.conservativityContainer}>
                        <div className={stepStyles.menuContainer}>
                            <div className={stepStyles.iconContainer}>
                                <Image
                                    src={imports.getIcon(location)}
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
                                <option value="none" className={stepStyles.menuOption}>
                                    None
                                </option>

                                <option value="low" className={stepStyles.menuOption}>
                                    Low
                                </option>
                                <option value="moderate" className={stepStyles.menuOption}>
                                    Moderate
                                </option>
                                <option value="high" className={stepStyles.menuOption}>
                                    High
                                </option>
                            </select>
                        </div>

                        <div className={stepStyles.infoContainer}>
                            <p>Same Region Avoidance Seeding</p>
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
                                    src={imports.getIcon(historation)}
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
                                <option value="none" className={stepStyles.menuOption}>
                                    None
                                </option>

                                <option value="low" className={stepStyles.menuOption}>
                                    Low
                                </option>
                                <option value="moderate" className={stepStyles.menuOption}>
                                    Moderate
                                </option>
                                <option value="high" className={stepStyles.menuOption}>
                                    High
                                </option>
                            </select>
                        </div>

                        <div className={stepStyles.infoContainer}>
                            <p>Recently Played Avoidance Seeding</p>
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
                        max={preavoidancePlayerList.length}
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
                                    the avoidance seeding process.
                                </p>
                            </InlineMessage>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    )
}