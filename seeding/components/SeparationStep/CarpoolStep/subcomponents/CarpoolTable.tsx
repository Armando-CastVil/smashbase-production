import { FC, Fragment } from "react";
import globalStyles from "../../../../../styles/GlobalSeedingStyles.module.css"
import Image from "next/image";
import { Carpool, Player } from "../../../../definitions/seedingTypes";
import * as imports from "../modules/CarpoolStepIndex"
import { Menu } from "@headlessui/react";
import stepStyles from "../../../../../styles/CarpoolStep.module.css"
import minusIcon from "../../../../../assets/seedingAppPics/minusIcon.png"
import DynamicTable from "@atlaskit/dynamic-table";
interface props {
    playerList: Player[];
    carpoolList: Carpool[];
    playerMap: Map<number, Player>
    setCarpoolList: (carpools: Carpool[]) => void;
}
export default function CarpoolTable({ playerList, carpoolList, playerMap, setCarpoolList }: props) {
    interface NameWrapperProps {
        children: React.ReactNode;
    }
    const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
        <span>{children}</span>
    );
    //this creates the headings for the carpool list dynamic table
    const createCarpoolTableHead = (withWidth: boolean) => {
        return {
            cells: [
                {
                    key: "Carpool",
                    content: <a className={globalStyles.seedHead}>Carpool Name</a>,
                    isSortable: true,
                    shouldTruncate: true,
                    width: withWidth ? 10 : undefined,
                },

                {
                    key: "Number of Members",
                    content: <a className={globalStyles.tableHead}>Number in Carpool</a>,
                    shouldTruncate: true,
                    isSortable: true,
                    width: withWidth ? 10 : undefined,
                },
                {
                    key: "Edit Carpool",
                    content: <a className={globalStyles.tableHead}>Remove Members</a>,
                    shouldTruncate: true,
                    isSortable: true,
                    width: withWidth ? 10 : undefined,
                },
            ],
        };
    };
    const carpoolTableHead = createCarpoolTableHead(true);
    //this is where the rows for the carpool list dynamic table are set
    const carpoolRows = carpoolList.map((carpool: Carpool, index: number) => ({
        key: `row-${index}-${carpool.carpoolName}`,
        isHighlighted: false,
        cells: [
            {
                key: imports.createCarpoolKey(carpoolList.length.toString()),
                content: (
                    <NameWrapper>
                        <p className={globalStyles.seedRow}>{carpool.carpoolName}</p>
                    </NameWrapper>
                ),
            },
            {
                key: imports.createCarpoolKey(carpoolList.length.toString()),
                content: (
                    <NameWrapper>
                        <p style={{ color: "white" }}>{carpool.carpoolMembers.length}</p>
                    </NameWrapper>
                ),
            },

            {
                key: carpool.carpoolName,
                content: (
                    <Menu>
                        <Menu.Button className={stepStyles.removeButton}>
                            <Image
                                src={minusIcon}
                                alt="minus icon"
                                style={{ width: "60%", height: "100%" }}
                            ></Image>
                        </Menu.Button>
                        <Menu.Items className={stepStyles.menuItemRemove}>
                            <Menu.Button
                                className={stepStyles.removeButton}
                                onClick={() => {
                                    imports.deleteCarpool(carpool.carpoolName, carpoolList,playerMap, setCarpoolList);
                                }}
                            >
                                Delete Carpool
                            </Menu.Button>
                            {carpool.carpoolMembers.map((playerID: number) => (
                                /* Use the `active` state to conditionally style the active item. */
                                <div key={playerID}>
                                    <Menu.Items as={Fragment}>
                                        {({ }) => (
                                            <button
                                                className={stepStyles.menuItemRemove}
                                                onClick={() => {
                                                    imports.removeFromCarpool(playerID, carpool, playerMap, carpoolList, setCarpoolList);
                                                }}
                                            >
                                                {playerMap.get(playerID)?.tag}{" "}
                                                <br/>
                                                <Image
                                                    src={minusIcon}
                                                    alt="minus icon"
                                                    style={{ width: "60%", height: "100%" }}
                                                ></Image>
                                                <br />
                                            </button>
                                        )}
                                    </Menu.Items>
                                    <br />
                                </div>
                            ))}
                        </Menu.Items>
                    </Menu>
                ),
            },
        ],
    }));

    return (
        <div className={globalStyles.tableComponent}>
            <DynamicTable
                head={carpoolTableHead}
                rows={carpoolRows}
                rowsPerPage={carpoolList.length}
                defaultPage={1}
                loadingSpinnerSize="large"
            />
        </div>
    )
}