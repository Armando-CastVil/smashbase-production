import Image from "next/image";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/CarpoolStep.module.css";
import addIcon from "assets/seedingAppPics/addIcon.png";
import minusIcon from "assets/seedingAppPics/minusIcon.png";
import plusSquare from "assets/seedingAppPics/plusSquare.png";
import Tournament from "../classes/Tournament";
import Event from "../classes/TourneyEvent";
import axios from "axios";
import TourneyEvent from "../classes/TourneyEvent";
import getBracketData from "../modules/getBracketData";
import { setPlayerInfoFromPhase } from "../modules/setPlayerInfoFromPhase";
import assignBracketIds from "../modules/assignBracketIds";
import getMatchList from "../modules/getMatchList";
import setProjectedPath from "../modules/setProjectedPath";
import Competitor from "../classes/Competitor";
import DynamicTable from "@atlaskit/dynamic-table";
import { FC, Fragment } from "react";
import { css, jsx } from "@emotion/react";
import { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { Carpool } from "../seedingTypes";
import { Menu } from "@headlessui/react";
import getSeparationVer2 from "../modules/getSeparationVer2";
import SeedingFooter from "./SeedingFooter";
import InlineMessage from "@atlaskit/inline-message";
import buildSeparationMap from "../modules/buildSeparationMap";
import stringToValueConservativity from "../modules/stringToValueConservativity";
import stringToValueHistoration from "../modules/stringToValueHistoration";
import stringToValueLocation from "../modules/stringToValueLocation";
import Sidebar from "../../globalComponents/Sidebar";
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
  setShowCarpoolPage: (showCarpoolPage: boolean) => void;
  setCarpoolList: (carpools: Carpool[]) => void;
  carpoolList: Carpool[];
}

////Don't know what this does but things break if we delete them
interface NameWrapperProps {
  children: React.ReactNode;
}

export default function CarpoolStep({
  page,
  apiKey,
  playerList,
  setPlayerList,
  phaseGroupData,
  setShowCarpoolPage,
  setCarpoolList,
  carpoolList,
  setPage,
}: props) {
  //hook states where we will store the carpools and the name of the current carpool being created

  const [carpoolName, setCarpoolName] = useState<string | undefined>("");
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);

  const handleClick = () => {
    setShowCarpoolPage(false);
  };

  //this is to show a loading wheel if data is still being fetched from start.gg
  let isLoading = true;
  if (playerList.length != 0) {
    isLoading = false;
  }
  //hashmap so we can retrieve players by their smashgg ids
  let playerMap = new Map<string, Competitor>();

  //put key value pairs in hashmap
  for (let i = 0; i < playerList.length; i++) {
    let key: string | number = playerList[i].smashggID;
    let value: Competitor = playerList[i];
    playerMap.set(key, value);
  }

  //this function adds a player to a carpool
  function addToCarpool(
    smashggID: string,
    carpool: Carpool,
    playerMap: Map<string, Competitor>
  ) {
    let player = playerMap.get(smashggID);
    //this is to remove a player from another carpool if theyre already in one
    if (player!.carpool != undefined) {
      for (let i = 0; i < carpoolList.length; i++) {
        if (carpoolList[i].carpoolName == player!.carpool.carpoolName) {
          for (let j = 0; j < carpoolList[i].carpoolMembers.length; j++) {
            if (carpoolList[i].carpoolMembers[j] == player!.smashggID) {
              carpoolList[i].carpoolMembers.splice(j, 1);
            }
          }
        }
      }
    }
    if (player != undefined) {
      carpool.carpoolMembers.push(player.smashggID);
      player.carpool = carpool;
    }

    setCarpoolList(carpoolList.slice());
  }

  //function that removes a player from a carpool and sets that player's carpool attribute to undefined
  function removeFromCarpool(smashggID: string, carpoolToChange: Carpool) {
    const nextCarpoolList = carpoolList.map((carpool) => {
      if (carpool.carpoolName == carpoolToChange.carpoolName) {
        for (let i = 0; i < carpool.carpoolMembers.length; i++) {
          if (carpool.carpoolMembers[i] == smashggID) {
            playerMap.get(smashggID)!.carpool = undefined;
            carpool.carpoolMembers.splice(i, 1);
          }
        }
      }
      return carpool;
    });
    setCarpoolList(nextCarpoolList);
  }

  //handles the creation of a new carpool, not to be confused with handling submission of this step
  const handleCarpoolSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (carpoolName?.length == 0) {
      alert("Please enter a name for the carpool.");
      return;
    }
    let tempCarpoolList = carpoolList.slice();
    let tempCarpool: Carpool = {
      carpoolName: "test carpool",
      carpoolMembers: [],
    };
    for (let i = 0; i < tempCarpoolList.length; i++) {
      if (tempCarpoolList[i].carpoolName == carpoolName) {
        alert("There is already a carpool with that name.");
        return;
      }
    }

    tempCarpool.carpoolName = carpoolName;
    tempCarpoolList.push(tempCarpool);

    setCarpoolList(tempCarpoolList);
  };

  //variable to hold a copy of the list of players. please fix later
  var tempPlayerList: Competitor[] = playerList;

  function deleteCarpool(carpoolName: string | number | undefined) {
    setCarpoolList(
      carpoolList.filter((carpool) => carpool.carpoolName !== carpoolName)
    );
  }

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
  const playerRows = tempPlayerList.map(
    (player: Competitor, index: number) => ({
      key: `row-${index}-${player.tag}`,
      isHighlighted: false,
      cells: [
        {
          key: createKey(player.tag),
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
          key: player.smashggID,
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
                            addToCarpool(player.smashggID, carpool, playerMap);
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
        key: createKey(carpoolList.length.toString()),
        content: (
          <NameWrapper>
            <p className={globalStyles.seedRow}>{carpool.carpoolName}</p>
          </NameWrapper>
        ),
      },
      {
        key: createKey(carpoolList.length.toString()),
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
                  deleteCarpool(carpool.carpoolName);
                }}
              >
                Delete Carpool
              </Menu.Button>
              {carpool.carpoolMembers.map((playerID: string) => (
                /* Use the `active` state to conditionally style the active item. */
                <div key={playerID}>
                  <Menu.Items as={Fragment}>
                    {({}) => (
                      <button
                        className={stepStyles.menuItemRemove}
                        onClick={() => {
                          removeFromCarpool(playerID, carpool);
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
        isVisible={isNextPageLoading}
      />
   
        <div className={globalStyles.content}>
          <div className={stepStyles.flexHeader}>
            <div className={globalStyles.heading}>
              <p>Separate players by carpool / Adjust settings</p>
            </div>
            <button className={stepStyles.button} onClick={handleClick}>
              Advanced Settings
            </button>
          </div>
          <div className={stepStyles.multiTableContainer}>
            <div className={stepStyles.leftTableContainer}>
              <div className={globalStyles.tableComponent}>
                <DynamicTable
                  isLoading={isLoading}
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
              <form onSubmit={handleCarpoolSubmit}>
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

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
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
