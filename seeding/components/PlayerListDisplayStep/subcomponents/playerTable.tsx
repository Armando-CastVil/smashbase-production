import { FC, useEffect, useState } from "react";
import { Player } from "../../../definitions/seedingTypes";
import globalStyles from "../../../../styles/GlobalSeedingStyles.module.css"
import stepStyles from "../../../../styles/PlayerListDisplayStep.module.css"
import createKey from "../modules/createKey";
import Image from "next/image";
import editButton from "../../../../assets/seedingAppPics/editButton.png"
import DynamicTable from "@atlaskit/dynamic-table";
import { useRef } from "react";
import React from "react";
import swapPlayersOnDragAndDrop from "../modules/swapPlayersOnDragAndDrop";
import { handleInputChange } from "../modules/handleInputChange";
import { DEFAULT_RATING } from "../../../utility/config";
import { handleInputBlur } from "../modules/handleInputBlur";
import { handleKeyDown } from "../modules/handleKeyDown";
import handleInputClick from "../modules/handleInputClick";

interface props {
  players: Player[];
  setPreavoidanceplayerList: (preAvoidancePlayers: Player[]) => void;
}

export default function playerTable({ players, setPreavoidanceplayerList }: props) {
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [value, setValue] = useState<number>();
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);


  useEffect(() => {
    inputRefs.current = Array(players.length)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>());
  }, [players]);

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
      ],
    };
  };

  //create head is set to true, so headings are created
  const head = createHead(true);


  let rating;
  const rows = players.map((player: Player, index: number) => ({
    key: `row-${index}-${player.tag}`,
    isHighlighted: false,
    cells: [
      {
        key: player.seed,
        content: (
          <div className={globalStyles.seedRow}>
            <div className={globalStyles.numberInputContainer}>
              <input
                type="text"
                className={globalStyles.numberInput}
                defaultValue={player.seed}
                onChange={(e) => handleInputChange(e, setValue)}
                onBlur={() => handleInputBlur(index, value, inputRefs.current, players, setPreavoidanceplayerList)}
                onKeyDown={(e) => handleKeyDown(e, index, value, inputRefs.current, players)}
                onClick={() => handleInputClick(index, inputRefs.current)}
                ref={inputRefs.current[players.indexOf(player)]}
              />
              <Image
                className={globalStyles.numberInputIcon}
                src={editButton}
                alt="Edit Button"
                loading="lazy"
              />
            </div>
          </div>
        ),
      },
      {
        key: createKey(player.tag),
        content: (
          <NameWrapper>
            <a className={globalStyles.tableRow}>{player.tag}</a>
          </NameWrapper>
        ),
      },
      {
        key: player.playerID,
        content: (
          <div className={globalStyles.tableRow}>
            {player.rating == DEFAULT_RATING
              ? (rating = player.rating.toFixed(2) + " (UNRATED)")
              : player.rating.toFixed(2)}
          </div>
        ),
      },
    ],
  }));


let indexPage=1

  return (

    <div className={stepStyles.tableComponent}>
      <DynamicTable
        onSetPage={(page) => {
          setCurrentPage(page); 
        }}
        defaultPage={currentPage}
        head={head}
        rows={rows}
        rowsPerPage={12}
        loadingSpinnerSize="large"
        isRankable={true}
        onRankEnd={(params) => {
          const globalSourceIndex = (currentPage - 1) * 12 + params.sourceIndex;
          const globalDestinationIndex = (currentPage - 1) * 12 + (params.destination?.index || 0);
          const updatedPlayers = swapPlayersOnDragAndDrop(
            globalSourceIndex,
            globalDestinationIndex,
            players
          );
          
          setPreavoidanceplayerList(updatedPlayers);
        }}
        
      />
    </div>


  )

}