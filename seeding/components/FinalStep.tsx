import Image from "next/image";
import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/FinalStep.module.css";
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
import { FC, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { getAuth } from "firebase/auth";
const auth = getAuth();

import {
  ClassAttributes,
  OlHTMLAttributes,
  LegacyRef,
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
  LiHTMLAttributes,
} from "react";
import SeedingFooter from "./SeedingFooter";
import processPhaseGroups from "../modules/processPhaseGroups";
import setMatchProperties from "../modules/setMatchProperties";
import { arrayMoveImmutable } from "array-move";
import verifyKeyAndURL, { OK } from "../modules/verifyKeyAndURL";
import pushSeeding from "../modules/pushSeeding";
import InlineMessage from "@atlaskit/inline-message";
import SeedingOutro from "./SeedingOutro";
import writeToFirebase from "../modules/writeToFirebase";
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
  setFinalPlayerList: (competitors: Competitor[]) => void;
  slug: string | undefined;
  phaseGroups: number[] | undefined;
  phaseGroupData: phaseGroupDataInterface;
  setEndTime: (startTime: number) => void;
}

////Don't know what this does but things break if we delete them
interface NameWrapperProps {
  children: React.ReactNode;
}
export default function FinalStep({
  page,
  setPage,
  apiKey,
  playerList,
  setFinalPlayerList,
  slug,
  phaseGroups,
  phaseGroupData,
  setEndTime,
}: props) {
  //state to shold submit status
  const [submitStatus, setSubmitStatus] = useState(false);
  //state to hold success status
  const [successStatus, setSuccessStatus] = useState<string | undefined>();
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false);

  //variable to hold temporary copy of player list, fix later
  var tempPlayerList: Competitor[] = playerList;

  //this function assigns new seeds and updates the playerList state
  async function assignSeed(playerList: Competitor[]) {
    const nextPlayerList = playerList.map((p, i) => {
      p.seed = i + 1;
      return p;
    });

    setFinalPlayerList(nextPlayerList);
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

  //this function pushes the seeding to smashgg
  const handleSubmit = async () => {
    setIsNextPageLoading(true);
    assignSeedIDs(playerList, phaseGroupData);
    console.log(playerList);
    setSubmitStatus(true);
    try {
      let errors = await pushSeeding(
        playerList,
        phaseGroupData.phaseIDs[0],
        apiKey!
      );
      console.log(errors);
      if (errors === undefined) {
        setSuccessStatus(OK);
      } else {
        setSuccessStatus("unknown error try again");
      }
      setSubmitStatus(true);

      //data collection
      let miniSlug = slug!
        .replace("/event/", "__")
        .substring("tournament/".length);
      writeToFirebase(
        "/usageData/" +
          auth.currentUser!.uid +
          "/" +
          miniSlug +
          "/postSeparationSeeding",
        playerList.map((c: Competitor) => c.smashggID)
      );
    } catch (e: any) {
      console.log(e);
      setSuccessStatus("unknown error try again");
      setSubmitStatus(true);
    }
    setEndTime(new Date().getTime());
    setIsNextPageLoading(false);

    setPage(page + 1);
  };

  ////Don't know what this does but things break if we delete them
  const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
    <span>{children}</span>
  );

  //this creates the headings for the player list dynamic table
  const createHead = (withWidth: boolean) => {
    return {
      cells: [
        {
          key: "seed",
          content: <a className={globalStyles.seedHead}>Seed</a>,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
        {
          key: "Player",
          content: <a className={globalStyles.tableHead}>Player</a>,
          shouldTruncate: true,
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
        {
          key: "carpool",
          content: <a className={globalStyles.tableHead}>Carpool</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
      ],
    };
  };

  //this sets the create heading functions to true
  const head = createHead(true);

  //this is where the rows for the player list dynamic table are set
  const rows = tempPlayerList.map((player: Competitor, index: number) => ({
    key: `row-${index}-${player.tag}`,
    isHighlighted: false,
    cells: [
      {
        key: player.seed,
        content: (
          <p className={globalStyles.seedRow}>
            {playerList.indexOf(player) + 1}
          </p>
        ),
      },
      {
        key: createKey(player.tag),
        content: (
          <NameWrapper>
            <p className={globalStyles.tableRow}>{player.tag}</p>
          </NameWrapper>
        ),
      },
      {
        key: player.smashggID,
        content: (
          <p className={globalStyles.tableRow}>{player.rating.toFixed(2)}</p>
        ),
      },
      {
        key: player.smashggID + "1",
        content: (
          <p className={globalStyles.tableRow}>{player.carpool?.carpoolName}</p>
        ),
      },
    ],
  }));

  //return function
  return (
    <div className={globalStyles.content}>
      <LoadingScreen
        message="Submitting seeding to start.gg."
        isVisible={isNextPageLoading}
      />
    
        <div className={globalStyles.content}>
          <div className={stepStyles.pageContent}>
          <div className={globalStyles.heading}>
            <p>Check and submit seeding</p>
          </div>
          <div className={stepStyles.tableContainer}>
            <div className={globalStyles.tableComponent}>
              <DynamicTable
                head={head}
                rows={rows}
                rowsPerPage={playerList.length}
                defaultPage={1}
                loadingSpinnerSize="large"
                isRankable={false}
                onRankEnd={(params) =>
                  swapCompetitors(params.sourceIndex, params.destination?.index)
                }
              />
            </div>
            <div className={stepStyles.warningContainer}>
              <div className={globalStyles.errorMessages}>
              <InlineMessage
                appearance="warning"
                title={
                  <div>
                    <p>
                      Pushing submit will upload this seeding to  your Start.gg event!
                    </p>
                  </div>
                }
              ></InlineMessage>
              </div>
             
            </div>
          </div>

          <div className={globalStyles.seedingFooterContainer}>
            <SeedingFooter
              page={page}
              setPage={setPage}
              handleSubmit={handleSubmit}
            ></SeedingFooter>
          </div>
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
