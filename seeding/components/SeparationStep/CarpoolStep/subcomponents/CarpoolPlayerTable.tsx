import { Menu } from "@headlessui/react";
import globalStyles from "../../../../../styles/GlobalSeedingStyles.module.css"
import stepStyles from "../../../../../styles/CarpoolStep.module.css"
import { FC, Fragment } from "react";
import { Carpool, Player } from "../../../../definitions/seedingTypes";
import * as imports from "../modules/CarpoolStepIndex"
import Image from "next/image";
import addIcon from "../../../../../assets/seedingAppPics/addIcon.png";
import DynamicTable from "@atlaskit/dynamic-table";
interface props {
    playerList: Player[];
    carpoolList: Carpool[];
    playerMap: Map<number, Player>
    setCarpoolList: (carpools: Carpool[]) => void;
}
export default function CarpoolPlayerTable({ playerList, carpoolList, playerMap, setCarpoolList }: props) {
    //this creates the headings for the player list dynamic table
    const createplayerTableHead = (withWidth: boolean) => {
        return {
            cells: [
                {
                    key: "player",
                    content: <a className={globalStyles.seedHead}>Player</a>,
                    isSortable: true,
                    shouldTruncate: true,
                    width: withWidth ? 10 : undefined,
                },

                {
                    key: "Carpool",
                    content: <a className={globalStyles.tableHead}>Carpool</a>,
                    shouldTruncate: true,
                    isSortable: true,
                    width: withWidth ? 10 : undefined,
                },
                {
                    key: "Add Carpool",
                    content: <a className={globalStyles.tableHead}>Add to Carpool</a>,
                    shouldTruncate: true,
                    isSortable: true,
                    width: withWidth ? 10 : undefined,
                },
            ],
        };
    };

    //this sets the create heading functions to true
    const playerTableHead = createplayerTableHead(true);

    ////Don't know what this does but things break if we delete them
    
    interface NameWrapperProps {
        children: React.ReactNode;
    }
    const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
        <span>{children}</span>
    );

    //this is where the rows for the player list dynamic table are set
    const playerRows = playerList.map(
        (player: Player, index: number) => ({
            key: `row-${index}-${player.tag}`,
            isHighlighted: false,
            cells: [
                {
                    key: imports.createCarpoolKey(player.tag),
                    content: (
                        <NameWrapper>
                            <p className={globalStyles.seedRow}>{player.tag}</p>
                        </NameWrapper>
                    ),
                },
                {
                    key: player.carpool?.carpoolName,
                    content: (
                        <NameWrapper>
                            <p className={globalStyles.tableRow}>
                                {player.carpool?.carpoolName}
                            </p>
                        </NameWrapper>
                    ),
                },

                {
                    key: player.playerID,
                    content: (
                        <Menu>
                            <Menu.Button
                                className={stepStyles.carpoolButton}
                                onClick={() => {
                                    if (carpoolList.length === 0) {
                                        alert(
                                            "No carpools available! Please use the create carpool button."
                                        );
                                    }
                                }}
                            >
                                <Image
                                    src={addIcon}
                                    alt="add icon"
                                    style={{ width: "50%", height: "100%" }}
                                ></Image>
                            </Menu.Button>
                            <Menu.Items className={stepStyles.menuItemAdd}>
                                {carpoolList.map((carpool, index) => (
                                    <div key={index}>
                                        <Menu.Item as={Fragment}>
                                            {({ active }) => (
                                                <button
                                                    className={stepStyles.menuItemAdd}
                                                    onClick={() => {
                                                        imports.addToCarpool(player.playerID, carpool, playerMap, carpoolList, setCarpoolList);
                                                    }}
                                                >
                                                    {carpool.carpoolName}
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <br />
                                    </div>
                                ))}
                            </Menu.Items>
                        </Menu>
                    ),
                },
            ],
        })
    );

    return (
        <div className={globalStyles.tableComponent}>
            <DynamicTable
                head={playerTableHead}
                rows={playerRows}
                rowsPerPage={playerList.length}
                defaultPage={1}
                loadingSpinnerSize="large"
            />
        </div>
    )
}