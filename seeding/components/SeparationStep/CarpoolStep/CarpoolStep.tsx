import Image from "next/image";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/CarpoolStep.module.css";
import addIcon from "assets/seedingAppPics/addIcon.png";
import minusIcon from "assets/seedingAppPics/minusIcon.png";
import DynamicTable from "@atlaskit/dynamic-table";
import { FC, Fragment } from "react";
import { useState } from "react";
import LoadingScreen from "../../LoadingScreen";
import { Carpool, Player } from "../../../definitions/seedingTypes";
import { Menu } from "@headlessui/react";
import SeedingFooter from "../../SeedingFooter";
import * as imports from "./modules/CarpoolStepIndex"


////Don't know what this does but things break if we delete them
interface NameWrapperProps {
  children: React.ReactNode;
}

export default function CarpoolStep({page,playerList,setFinalPlayerList,setShowCarpoolPage,setCarpoolList,carpoolList,setPage}: imports.carpoolProps) {
  //hook states where we will store the carpools and the name of the current carpool being created
  const [carpoolName, setCarpoolName] = useState<string | undefined>("");

  //hashmap so we can retrieve players by their smashgg ids
  let playerMap:Map<number, Player>=imports.createPlayerMap(playerList)

 

 

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

  //this sets the create heading functions to true
  const playerTableHead = createplayerTableHead(true);
  const carpoolTableHead = createCarpoolTableHead(true);

  ////Don't know what this does but things break if we delete them
  const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
    <span>{children}</span>
  );

  //this is where the rows for the player list dynamic table are set
  const playerRows = playerList.map(
    (player:Player, index: number) => ({
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
                             imports.addToCarpool(player.playerID,carpool,playerMap,carpoolList,setCarpoolList);
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
                  imports.deleteCarpool(carpool.carpoolName,carpoolList,setCarpoolList);
                }}
              >
                Delete Carpool
              </Menu.Button>
              {carpool.carpoolMembers.map((playerID: number) => (
                /* Use the `active` state to conditionally style the active item. */
                <div key={playerID}>
                  <Menu.Items as={Fragment}>
                    {({}) => (
                      <button
                        className={stepStyles.menuItemRemove}
                        onClick={() => {
                          imports.removeFromCarpool(playerID, carpool,playerMap,carpoolList,setCarpoolList);
                        }}
                      >
                        {playerMap.get(playerID)?.tag}{" "}
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

  //return function
  return (
    <div className={globalStyles.content}>
      <LoadingScreen
        message="Separating players based on your input. The process might take a few seconds up to a couple minutes depending on the number of entrants."
        isVisible={playerList.length==0}
      />
        <div className={globalStyles.content}>
          <div className={stepStyles.flexHeader}>
            <div className={globalStyles.heading}>
              <p>Separate players by carpool / Adjust settings</p>
            </div>
            <button className={stepStyles.button} onClick={()=>setShowCarpoolPage(false)}>
              Advanced Settings
            </button>
          </div>
          <div className={stepStyles.multiTableContainer}>
            <div className={stepStyles.leftTableContainer}>
              <div className={globalStyles.tableComponent}>
                <DynamicTable
                  head={playerTableHead}
                  rows={playerRows}
                  rowsPerPage={playerList.length}
                  defaultPage={1}
                  loadingSpinnerSize="large"
                />
              </div>
            </div>

            <div className={stepStyles.rightTableContainer}>
              <div className={globalStyles.tableComponent}>
                <DynamicTable
                  head={carpoolTableHead}
                  rows={carpoolRows}
                  rowsPerPage={carpoolList.length}
                  defaultPage={1}
                  loadingSpinnerSize="large"
                />
              </div>
              <form onSubmit={(e)=>imports.handleMakeCarpool(e,carpoolName,carpoolList,setCarpoolList)}>
            <label className={stepStyles.labelMessage}>
              <input
                type="text"
                className={stepStyles.labelMessage}
                placeholder="Carpool Name"
                value={carpoolName}
                onChange={(e) => setCarpoolName(e.target.value)}
              />
            </label>
            <input
              className={stepStyles.createCarpoolButton}
              type="submit"
              value="Create Carpool"
              style={{ color: "white" }}
            />
          </form>
          </div>
          
            </div>
          <div className={globalStyles.seedingFooterContainer}>
            <SeedingFooter
              page={page}
              setPage={setPage}
              isDisabled={true}
            ></SeedingFooter>
          </div>
          </div>
        </div>
      
  );
}


