import Image from "next/image";
import styles from "/styles/Seeding.module.css";
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
    numStaticSeeds: number;
    conservativity: string;
    location: string;
    historation: string;
}

////Don't know what this does but things break if we delete them
interface NameWrapperProps {
  children: React.ReactNode;
}

export default function CarpoolStep({ page, setPage, apiKey, playerList, setPlayerList, phaseGroupData,setShowCarpoolPage,numStaticSeeds,conservativity,location,historation}: props) {
  //hook states where we will store the carpools and the name of the current carpool being created
  const [carpoolList, setCarpoolList] = useState<Carpool[]>([]);
  const [carpoolName, setCarpoolName] = useState<string | undefined>("");
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false)

  const handleClick = () => {
    setShowCarpoolPage(false);
  };

  //check to see if the first player's projected path does not exist, if it doesn't then the bracket is private
  let isBracketPrivate: boolean = false
  if (playerList.length != 0 && playerList[0].projectedPath.length == 0) {
    isBracketPrivate = true;
  }
  //this is to show a loading wheel if data is still being fetched from start.gg
  let isLoading = true
  if (playerList.length != 0) {
    isLoading = false
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
            if (
              carpoolList[i].carpoolMembers[j] == player!.smashggID
            ) {
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

  //this step's submit function calls the separation function and updates the player list
  async function handleSubmit() {
    
    setIsNextPageLoading(true)
    assignSeedIDs(playerList, phaseGroupData);
    setPlayerList(getSeparationVer2(playerList, await buildSeparationMap(
        playerList,
        carpoolList,
        stringToValueHistoration(historation),
        stringToValueLocation(location)
    ),numStaticSeeds,stringToValueConservativity(conservativity)));
    setIsNextPageLoading(false)
    setPage(page + 1);
  }

  function deleteCarpool(carpoolName:string|number|undefined)
  {
    setCarpoolList(carpoolList.filter(carpool => carpool.carpoolName!== carpoolName)) 
  }

  //this creates the headings for the player list dynamic table
  const createplayerTableHead = (withWidth: boolean) => {
    return {
      cells: [
        {
          key: "player",
          content: <a className={styles.seedHead}>Player</a>,
          isSortable: true,
          shouldTruncate: true,
          width: withWidth ? 10 : undefined,
        },

        {
          key: "Carpool",
          content: <a className={styles.tableHead}>Carpool</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
        {
          key: "Add Carpool",
          content: <a className={styles.tableHead}>Add to Carpool</a>,
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
          content: <a className={styles.seedHead}>Carpool Name</a>,
          isSortable: true,
          shouldTruncate: true,
          width: withWidth ? 10 : undefined,
        },

        {
          key: "Number of Members",
          content: <a className={styles.tableHead}>Number in Carpool</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
        {
          key: "Edit Carpool",
          content: <a className={styles.tableHead}>Remove Members</a>,
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
              <p className={styles.seedRow}>{player.tag}</p>
            </NameWrapper>
          ),
        },
        {
          key: player.carpool?.carpoolName,
          content: (
            <NameWrapper>
              <p className={styles.tableRow}>{player.carpool?.carpoolName}</p>
            </NameWrapper>
          ),
        },

        {
          key: player.smashggID,
          content: (
            <Menu>
              <Menu.Button className={styles.carpoolButton}>Add To Carpool</Menu.Button>
              <Menu.Items className={styles.menuItemAdd}>
                {carpoolList.map((carpool) => (
                  <div>
                    <Menu.Item key={carpool.carpoolName} as={Fragment}>
                      {({ active }) => (
                        <button
                          className={styles.menuItemAdd}
                          onClick={() => {
                            addToCarpool(player.smashggID, carpool, playerMap);
                          }}
                        >
                          {carpool.carpoolName}
                        </button>
                      )}
                    </Menu.Item>
                    <br></br>
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
            <p className={styles.seedRow}>{carpool.carpoolName}</p>
          </NameWrapper>
        ),
      },
      {
        key: createKey(carpoolList.length.toString()),
        content: (
          <NameWrapper>
            <p>{carpool.carpoolMembers.length}</p>
          </NameWrapper>
        ),
      },

      {
        key: carpool.carpoolName,
        content: (
          <Menu>
            <Menu.Button className={styles.removeButton}>Remove Players</Menu.Button>
            <Menu.Items className={styles.menuItemRemove}>
              <Menu.Button className={styles.removeButton} onClick={() => {
                          deleteCarpool(carpool.carpoolName);
                        }}>Delete Carpool</Menu.Button>
              {carpool.carpoolMembers.map((playerID: string) => (
                /* Use the `active` state to conditionally style the active item. */
                <div>
                  <Menu.Items key={playerID} as={Fragment}>
                    {({ }) => (
                      <button
                        className={styles.menuItemRemove}
                        onClick={() => {
                          removeFromCarpool(playerID, carpool);
                        }}
                      >
                        {playerMap.get(playerID)?.tag}
                        <br></br>
                      </button>
                    )}
                  </Menu.Items>
                  <br></br>
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
    <div>
      <LoadingScreen message='Separating players based on your input. The process might take a few seconds up to a couple minutes depending on the number of entrants.' isVisible={isNextPageLoading} />
      <div className={styles.upperBody}>
        <div className={styles.bodied}>
          <h6 className={styles.headingtext}>Optional - Add Players to Carpools</h6>
          <button className={styles.settingsButton}  onClick={handleClick} >Back to Separation Settings</button>

          <div className={styles.flexContainer}>
            <div className={styles.carpoolLeftDiv}>
              <div className={styles.carpoolPlayerTable}>
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
            <div className={styles.carpoolRightDiv}>
              <div className={styles.carpoolTable}>
                <DynamicTable
                  head={carpoolTableHead}
                  rows={carpoolRows}
                  rowsPerPage={carpoolList.length}
                  defaultPage={1}
                  loadingSpinnerSize="large"
                />

              </div>
              <form onSubmit={handleCarpoolSubmit}>
                <label className={styles.labelMessage}>
                  <input
                    type="text"
                    className={styles.labelMessage}
                    placeholder="Carpool Name"
                    value={carpoolName}
                    onChange={(e) => setCarpoolName(e.target.value)}
                  />
                </label>
                <input className={styles.createCarpoolButton} type="submit" value="Create" />
              </form>

            </div>
          </div>
          <div className={styles.carpoolWarning}>
            {
              isBracketPrivate ?
                <div className={styles.errorMessages}>
                  <InlineMessage
                    appearance="warning"
                    iconLabel="Warning: Bracket is private, so players may not be separated by set history."
                    secondaryText="Warning: Bracket is private, so players may not be separated by set history."
                  >
                    <p></p>
                  </InlineMessage>
                </div>
                : <p></p>
            }
          </div>
          

          <div className={styles.seedingFooterContainer}>
            <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit} ></SeedingFooter>
          </div>
        </div>
      </div>
    </div>
  );
}

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
}

function assignSeedIDs(playerList: Competitor[], phaseGroupData: phaseGroupDataInterface | undefined) {
  for (let i = 0; i < playerList.length; i++) {
    playerList[i].seedID = phaseGroupData!.seedIDMap.get(
      playerList[i].smashggID
    );
  }
}
