import { FC, useEffect, useState } from "react";
import { Player } from "../../../definitions/seedingTypes";
import globalStyles from "../../../../styles/GlobalSeedingStyles.module.css"
import stepStyles from "../../../../styles/PlayerListDisplayStep.module.css"
import Image from "next/image";
import editButton from "../../../../assets/seedingAppPics/editButton.png"
import { useRef } from "react";
import React from "react";
import { DEFAULT_RATING } from "../../../utility/config";
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import * as imports from "../modules/playerListDisplayStepIndex"
interface props {
  players: Player[];
  setPreavoidanceplayerList: (preAvoidancePlayers: Player[]) => void;
}

export default function playerTable({ players, setPreavoidanceplayerList }: props) {
  const [pageNumber, setPageNumber] = useState(1);
  const [value, setValue] = useState<number>();
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);


  useEffect(() => {
    inputRefs.current = Array(players.length)
      .fill(null)
      .map(() => React.createRef<HTMLInputElement>());
  }, [players]);

  const navigateTo = (pageNumber: number) => {
    setPageNumber(pageNumber);
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
                onChange={(e) => imports.handleInputChange(e, setValue)}
                onBlur={() => imports.handleInputBlur(index, value, inputRefs.current, players, setPreavoidanceplayerList)}
                onKeyDown={(e) => imports.handleKeyDown(e, index, value, inputRefs.current, players)}
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

  return (

    <div className={stepStyles.tableComponent}>
       
      <DynamicTableStateless
        page={pageNumber}
        head={head}
        rows={rows}
        rowsPerPage={12}
        loadingSpinnerSize="large"
        isRankable={true}
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
          setPreavoidanceplayerList(updatedPlayers);
        }}
      />
      <ButtonGroup>
        <Button
          isDisabled={pageNumber === 1}
          onClick={() => navigateTo(pageNumber - 1)}
        >
          Previous Page
        </Button>
        <Button
          isDisabled={pageNumber === 5}
          onClick={() => navigateTo(pageNumber + 1)}
        >
          Next Page
        </Button>
      </ButtonGroup>
    </div>

  )

}