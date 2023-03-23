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
import { FC, useState } from "react";

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

interface phaseGroupDataInterface {
  phaseIDs: number[];
  phaseIDMap: Map<number, number[]>;
  sets: any[];
}
interface props {
  page: number;
  setPage: (page: number) => void;
  apiKey: string | undefined;
  playerList: Competitor[];
  setPlayerList: (competitors: Competitor[]) => void;
  slug: string | undefined;
  phaseGroups: number[] | undefined;
  phaseGroupData: phaseGroupDataInterface;
}

////Don't know what this does but things break if we delete them
interface NameWrapperProps {
  children: React.ReactNode;
}
export default function FinalStep({page,setPage,apiKey,playerList,setPlayerList,slug,phaseGroups,phaseGroupData,}: props) {
  //state to shold submit status
  const [submitStatus, setSubmitStatus] = useState(false);
  //state to hold success status
  const [successStatus, setSuccessStatus] = useState<string | undefined>();

  //variable to hold temporary copy of player list, fix later
  var tempPlayerList: Competitor[] = playerList;

  //this function assigns new seeds and updates the playerList state
  async function assignSeed(playerList: Competitor[]) {
    const nextPlayerList = playerList.map((p, i) => {
      p.seed = i + 1;
      return p;
    });

    setPlayerList(nextPlayerList);
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
    } catch (e: any) {
      console.log(e);
      setSuccessStatus("unknown error try again");
      setSubmitStatus(true);
    }
    setPage(page+1);
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
          content: <a className={styles.seedHead}>Seed</a>,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
        {
          key: "Player",
          content: <a className={styles.tableHead}>Player</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 15 : undefined,
        },
        {
          key: "rating",
          content: <a className={styles.tableHead}>Rating</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
        {
          key: "carpool",
          content: <a className={styles.tableHead}>Carpool</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        }
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
          <p className={styles.seedRow}>{playerList.indexOf(player) + 1}</p>
        ),
      },
      {
        key: createKey(player.tag),
        content: (
          <NameWrapper>
            <p className={styles.tableRow}>{player.tag}</p>
          </NameWrapper>
        ),
      },
      {
        key: player.smashggID,
        content: <p className={styles.tableRow}>{player.rating.toFixed(2)}</p>,
      },
      {
        key: player.smashggID+"1",
        content: <p className={styles.tableRow}>{player.carpool?.carpoolName}</p>,
      }
    ],
  }));

  //return function
  return (
    <div>
      <div className={styles.upperBody}>
        <div className={styles.bodied}>
          <h6 className={styles.headingtext}>Check and Submit Final Seeding</h6>
          <div className={styles.finalList}>
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
          <SeedingFooter
            page={page}
            setPage={setPage}
            handleSubmit={handleSubmit}
          ></SeedingFooter>
        </div>
      </div>
    </div>
  );
}

function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, "").replace(/\s/g, "") : input;
}
