import { FC, useEffect, useState } from "react";
import { Player } from "../../../definitions/seedingTypes";
import globalStyles from "../../../../styles/GlobalSeedingStyles.module.css"
import stepStyles from "../../../../styles/PlayerListDisplayStep.module.css"
import Image from "next/image";
import editButton from "../../../../assets/seedingAppPics/editButton.png"
import { useRef } from "react";
import React from "react";
import { getDefaultRating } from "../../EventDisplayStep/modules/getPlayerData";
import DynamicTable from '@atlaskit/dynamic-table';
import * as imports from "../modules/playerListDisplayStepIndex"
interface props {
  players: Player[];
  setPreavoidancePlayerList: (preAvoidancePlayers: Player[]) => void;
  setWasPlayerListChanged:(wasPlayerListChanged:boolean)=>void;
  melee: boolean;
}

export default function playerTable({ players, setPreavoidancePlayerList,setWasPlayerListChanged, melee }: props) {
  const [pageNumber, setPageNumber] = useState(1);
  //change to more descriptive
  const [formValue, setformValue] = useState<number>();
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const [previousPlayers, setPreviousPlayers] = useState<Player[]>(players)


  useEffect(() => {
    inputRefs.current = Array(players.length)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>());
  }, [players]);

  useEffect(() => {
    // Check if players have changed
    if (!arraysAreEqual(previousPlayers, players)) {
      setWasPlayerListChanged(true);
    } else {
      setWasPlayerListChanged(false);
    }
    // Update the previousPlayers state with the current players
    setPreviousPlayers(players);
  }, [players, setWasPlayerListChanged]);
  


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
        key: players.indexOf(player)+1,
        content: (
          <div className={globalStyles.seedRow}>
            <div className={globalStyles.numberInputContainer}>
              <input
                type="text"
                className={globalStyles.numberInput}
                defaultValue={players.indexOf(player)+1}
                onChange={(e) => imports.handleInputChange(e, setformValue)}
                onBlur={() => imports.handleInputBlur(index, formValue, inputRefs.current, players, setPreavoidancePlayerList)}
                onKeyDown={(e) => imports.handleKeyDown(e, index, formValue, inputRefs.current, players)}
                onClick={() => imports.handleInputClick(index, inputRefs.current)}
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
        key: imports.createKey(player.tag),
        content: (
          <NameWrapper>
            <a className={globalStyles.tableRow}>{player.tag}</a>
          </NameWrapper>
        ),
      },
      {
        key: player.rating,
        content: (
          <div className={globalStyles.tableRow}>
            {player.rating == getDefaultRating(melee)
              ? (rating = player.rating.toFixed(2) + " (UNRATED)")
              : player.rating.toFixed(2)}
          </div>
        ),
      },
    ],
  }));

  return (

    <div className={stepStyles.tableComponent}>
       
      <DynamicTable
        page={pageNumber}
        head={head}
        rows={rows}
        rowsPerPage={12}
        loadingSpinnerSize="large"
        isRankable={true}
        sortOrder="DESC"
        onSetPage={(newPage) => {
          setPageNumber(prevPage => newPage); // Use functional update
        }}
        onRankEnd={(params) => {
          const globalSourceIndex = (pageNumber - 1) * 12 + params.sourceIndex;
          const globalDestinationIndex = (pageNumber - 1) * 12 + (params.destination?.index || 0);
          const updatedPlayers = imports.swapPlayersOnDragAndDrop(
            globalSourceIndex,
            globalDestinationIndex,
            players
          );
          
          setPreavoidancePlayerList(updatedPlayers);
        }}
      />
     
    </div>

  )

}

function arraysAreEqual(array1: Player[], array2: Player[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
