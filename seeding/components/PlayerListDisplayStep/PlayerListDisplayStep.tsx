import Image from "next/image";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/PlayerListDisplayStep.module.css";
import Competitor from "../../classes/Competitor";
import DynamicTable from "@atlaskit/dynamic-table";
import editButton from "/assets/seedingAppPics/editButton.png";
import { FC, useEffect, useRef, useState } from "react";
import { arrayMoveImmutable } from "array-move";
import * as imports from "./modules/playerListDisplayStepIndex"
import SeedingFooter from "../SeedingFooter";
import processPhaseGroups from "../../modules/processPhaseGroups";
import setMatchProperties from "../../modules/setMatchProperties";
import InlineMessage from "@atlaskit/inline-message";
import React from "react";
import writeToFirebase from "../../modules/writeToFirebase";
import { getAuth } from "firebase/auth";
import { Player } from "../../definitions/seedingTypes";
import { phaseGroupDataInterface } from "./modules/phaseGroupDataInterface";

const auth = getAuth();




//Don't know what this does but things break if we delete them
interface NameWrapperProps {
  children: React.ReactNode;
}

export default function PlayerListDisplayStep({
  page,
  setPage,
  apiKey,
  playerList,
  setPreAvoidancePlayerList,
  slug,
  phaseGroups,
  setPhaseGroupData,
}: imports.playerListDisplayProps) {
  const [keyStatus, setKeyStatus] = useState<number>(0);
  const [value, setValue] = useState<number>();
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);

  function initializeInputRefs(length: number) {
    inputRefs.current = Array(length)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>());
  }

  const handleInputFocus = (index: number) => {
    setFocusedIndex(index);
  };

  useEffect(() => {
    inputRefs.current = Array(playerList.length)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>());
  }, [playerList]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setValue(newValue);
  };

  const handleInputBlur = (index: number) => {
    setFocusedIndex(-1);
    if (!value) {
      if (inputRefs.current[index].current) {
        inputRefs.current[index].current!.value = (index + 1).toString();
      }
    } else if (value < 1 || value > playerList.length) {
      inputRefs.current[index].current!.value = (index + 1).toString();
      alert("please enter a value between 1 and " + playerList.length);
    } else if (value == index + 1) {
      if (inputRefs.current[index].current) {
        inputRefs.current[index].current!.value = (index + 1).toString();
      }
    } else {
      editSeed(value, index);
    }
  };

  const handleIconClick = async (index: number) => {
    setFocusedIndex(-1);
    if ((value && value <= 1) || (value && value > playerList.length)) {
      setValue(0);
      handleInputBlur(index);
    } else {
      handleInputBlur(index);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      if (inputRefs.current[index]?.current) {
        inputRefs.current[index].current!.blur();
      }

      if (!value) {
        if (inputRefs.current[index].current) {
          inputRefs.current[index].current!.value = (index + 1).toString();
        }
      } else if (value <= 1 || value > playerList.length) {
        inputRefs.current[index].current!.value = (index + 1).toString();
      } else if (value == index + 1) {
        if (inputRefs.current[index].current) {
          inputRefs.current[index].current!.value = (index + 1).toString();
        }
      }
    }
  };

  const handleInputClick = (index: number) => {
    if (inputRefs.current[index].current) {
      inputRefs.current[index].current!.focus();
    }
  };

  //this is the array where we will store all the comptetitors
  var tempPlayerList: Player[] = playerList;
  let isLoading = true;
  if (playerList.length != 0) {
    isLoading = false;
  }

  //this function assigns new seeds and updates the playerList state
  async function assignSeed(playerList: Player[]) {
    const nextPlayerList = playerList.map((p, i) => {
      p.ogSeedNum = i + 1;
      return p;
    });
    setPreAvoidancePlayerList(nextPlayerList);
  }

  //this function replaces a player's seed with user input and updates everyone else's seeds accordingly
  function editSeed(newSeed: number, index: number) {
    //new seed and old seed variables to account for player list order restructuring
    //list must be sorted by seed, so all seeds change depending on the scenario
    //for example if seed 1 is sent to last seed, everyone's seed goes up by 1 etc.
    let oldSeed = playerList[index].ogSeedNum;
    if (newSeed > playerList.length || newSeed <= 0) {
      setKeyStatus(1);
      if (inputRefs.current[index].current) {
        inputRefs.current[index].current!.value = (index + 1).toString();
      }
      playerList[index].ogSeedNum = index + 1;

      return;
    } else {
      let newPlayerList = arrayMoveImmutable(
        playerList,
        oldSeed - 1,
        newSeed - 1
      );
      assignSeed(newPlayerList);
    }
  }
  //handles the swapping of players during dragging and dropping
  async function swapCompetitors(
    firstPlayerIndex: number,
    secondPlayerIndex: number | undefined
  ) {
    //if they get dropped outside the table don't make any changes
    if (secondPlayerIndex == undefined) {
      return tempPlayerList;
    }
    //otherwise move the players
    else {
      let newPlayerList = arrayMoveImmutable(
        playerList,
        firstPlayerIndex,
        secondPlayerIndex
      );
      await assignSeed(newPlayerList);
    }
  }
  //handle submit function
  async function handleSubmit() {
    setIsNextPageLoading(true);
   
    setIsNextPageLoading(false);

    //data collection
    let miniSlug = slug!.replace("/event/", "__").substring("tournament/".length);
    writeToFirebase("/usageData/" +auth.currentUser!.uid +"/" + miniSlug +"/preSeparationSeeding",playerList.map((c: Player) => c.playerID));
    writeToFirebase(
      "/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/skipped",
      false
    );

    setPage(page + 1);
  }

  //handle submit function
  async function skipToLast() {
    setIsNextPageLoading(true);
    let processedPhaseGroupData: phaseGroupDataInterface =
      await processPhaseGroups(phaseGroups!, apiKey!);
    await setPhaseGroupData(processedPhaseGroupData);
   
    setIsNextPageLoading(false);

    //data collection
    let miniSlug = slug!
      .replace("/event/", "__")
      .substring("tournament/".length);
    writeToFirebase(
      "/usageData/" +
        auth.currentUser!.uid +
        "/" +
        miniSlug +
        "/preSeparationSeeding",
      playerList.map((c: Player) => c.playerID)
    );
    writeToFirebase(
      "/usageData/" +
        auth.currentUser!.uid +
        "/" +
        miniSlug +
        "/postSeparationSeeding",
      playerList.map((c: Player) => c.playerID)
    );
    writeToFirebase(
      "/usageData/" + auth.currentUser!.uid + "/" + miniSlug + "/skipped",
      true
    );

    setPage(6);
  }

  ////Don't know what this does but things break if we delete them
  const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
    <span>{children}</span>
  );

  //this is where we set the headings for the dynamic table
  const createHead = (withWidth: boolean) => {
    return {
      cells: [
        {
          key: "seed",
          content: <a className={globalStyles.seedHead}>Seed (Edit Seed)</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
        {
          key: "player",
          content: <a className={globalStyles.tableHead}>Player</a>,
          isSortable: true,
          width: withWidth ? 15 : undefined,
        },
        {
          key: "rating",
          content: <a className={globalStyles.tableHead}>Rating</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
      ],
    };
  };

  
  //get all the buttons and put them in an array
  let buttons = document.getElementsByTagName("button");

  //function that highlights the current page
  function highLightPage(epage: number) {
    for (let i = 0; i < buttons.length - 2; i++) {
      if (i == epage) {
        buttons[i].id = globalStyles.currentButton;
      } else {
        buttons[i].id = "";
      }
    }
  }

  return (
    <div>
      <imports.LoadingScreen
        message="Fetching data from the database. The process might take a few seconds up to a couple minutes depending on the number of entrants."
        isVisible={isLoading}
      />
        <div className={globalStyles.content}>
        <div className={stepStyles.tableContainer}>
          <div className={globalStyles.heading}>
            <p>Manually assign seeds</p>
          </div>
          {keyStatus == 0 ? (
            <p></p>
          ) : (
            <div className={globalStyles.errorMessages}>
              <InlineMessage
                appearance="error"
                iconLabel={
                  "Please enter a number between 1 and " + playerList.length
                }
                secondaryText={
                  "Please enter a number between 1 and " + playerList.length
                }
              ></InlineMessage>
            </div>
          )}
            <div className={stepStyles.tableComponent}>
              
            </div>
            <div className={stepStyles.skipMessage} onClick={skipToLast}>
                    <p>
                      If your bracket is private or you would like to avoid
                      separating by carpool or set history, you can &nbsp;
                      <a>skip to the last step by clicking here.</a>{" "}
                    </p>
                  </div>
          </div>
        

          <div className={globalStyles.seedingFooterContainer}>
            <SeedingFooter
              page={page}
              setPage={setPage}
              handleSubmit={handleSubmit}
              isDisabled={playerList.length == 0}
            ></SeedingFooter>
          </div>
        </div>
      </div>
     
  );
}
function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
}
