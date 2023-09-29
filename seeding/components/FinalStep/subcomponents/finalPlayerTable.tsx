import { FC, useEffect, useState } from "react";
import { Player } from "../../../definitions/seedingTypes";
import globalStyles from "../../../../styles/GlobalSeedingStyles.module.css"
import stepStyles from "../../../../styles/FinalStep.module.css"
import { useRef } from "react";
import React from "react";
import { DEFAULT_RATING } from "../../EventDisplayStep/modules/getPlayerData";
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import * as imports from "../../PlayerListDisplayStep/modules/playerListDisplayStepIndex"
import SeedingChangesHandler from "./seedingChangesHandler";

interface props {
  initialPlayers: Player[];
  players: Player[];
  setFinalPlayerList: (preAvoidancePlayers: Player[]) => void;
}


export default function finalPlayerTable({ initialPlayers, players, setFinalPlayerList }: props) {
  const [pageNumber, setPageNumber] = useState(1);
  //change to more descriptive
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const rowRefs = useRef<Array<React.RefObject<HTMLTableRowElement>>>([]);
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);

  useEffect(() => {
    inputRefs.current = Array(players.length)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>());
    rowRefs.current = Array(players.length)
      .fill(null)
      .map(() => React.createRef<HTMLTableRowElement>());
  }, [players]);

  const toggleRowHighlight = (rowKey: string) => {
    setHighlightedRows((prevHighlightedRows) => {
      if (prevHighlightedRows.includes(rowKey)) {
        return prevHighlightedRows.filter((key) => key !== rowKey);
      } else {
        return [...prevHighlightedRows, rowKey];
      }
    });
  };



  //Don't know what this does but things break if we delete them
  interface NameWrapperProps {
    children: React.ReactNode;
  }

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
        {
          key: "carpool",
          content: <a className={globalStyles.tableHead}>Carpool</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
        {
          key: "changes",
          content: <a className={globalStyles.tableHead}>Changes from Initial</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        }
      ],
    };
  };

  //create head is set to true, so headings are created
  const head = createHead(true);
  let rating;
  const rows = players.map((player: Player, index: number) => ({
    key: `row-${index}-${player.tag}`,
    isHighlighted: highlightedRows.includes(`row-${index}-${player.tag}`),
    cells: [

      {
        key: index,
        content: (
          <div className={globalStyles.seedRow}>
           {players.indexOf(player)+1}
          </div>
        ),
      },
      {
        key: imports.createKey(player.tag),
        content: (
          <NameWrapper>
            <a className={stepStyles.tableRow}>{player.tag}</a>
          </NameWrapper>
        ),
      },
      {
        key: imports.createKey(String(player.playerID - 10000)),
        content: (
          <div className={stepStyles.tableRow}>
            {player.rating == DEFAULT_RATING
              ? (rating = player.rating.toFixed(2) + " (UNRATED)")
              : player.rating.toFixed(2)}
          </div>
        ),
      },
      {
        key: imports.createKey(String(player.playerID)),
        content: (
          <div className={stepStyles.tableRow}>
            {player.carpool == undefined
              ? ("")
              : player.carpool.carpoolName}
          </div>
        ),
      },
      {
        key: imports.createKey(String(player.playerID + 10000)),
        content: (
          <div className={stepStyles.tableRow} >
            <SeedingChangesHandler
              initialSeed={initialPlayers.indexOf(player)}
              finalSeed={players.indexOf(player)}
            />
          </div>
        ),
      }

    ],
    innerRef: rowRefs.current[index],
    className: initialPlayers.indexOf(player) - players.indexOf(player) > 0
      ? stepStyles.tableRowPositive
      : initialPlayers.indexOf(player) - players.indexOf(player) < 0
        ? stepStyles.tableRowNegative
        : ""

  }));



  return (

    <div className={stepStyles.tableComponent}>
      <DynamicTableStateless
        page={pageNumber}
        head={head}
        rows={rows}
        rowsPerPage={players.length}
        loadingSpinnerSize="large"
        isRankable={false}
      />

    </div>

  )

}