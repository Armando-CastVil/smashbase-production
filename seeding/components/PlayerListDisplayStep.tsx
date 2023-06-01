import Image from 'next/image';
import styles from "styles/PlayerDisplayStep.module.css"
import Competitor from '../classes/Competitor';
import DynamicTable from '@atlaskit/dynamic-table';
import editButton from "/assets/seedingAppPics/editButton.png"
import { FC, useEffect, useRef, useState } from 'react';
import { arrayMoveImmutable } from 'array-move';
import LoadingScreen from './LoadingScreen';
import SeedingFooter from './SeedingFooter';
import processPhaseGroups from '../modules/processPhaseGroups';
import setMatchProperties from '../modules/setMatchProperties';
import InlineMessage from '@atlaskit/inline-message';
import React from 'react';
import writeToFirebase from '../modules/writeToFirebase';
import { getAuth } from 'firebase/auth';
const auth = getAuth();
interface phaseGroupDataInterface {
  phaseIDs: number[];
  phaseIDMap: Map<number, number[]>;
  seedIDMap: Map<number | string, number>;
  sets: any[];
}


//props passed from previous step
interface props {
  page: number;
  setPage: (page: number) => void;
  apiKey: string | undefined;
  playerList: Competitor[];
  setPlayerList: (competitors: Competitor[]) => void;
  slug: string | undefined;
  phaseGroups: number[] | undefined;
  setPhaseGroupData: (phaseGroupData: phaseGroupDataInterface) => void;
}

//Don't know what this does but things break if we delete them
interface NameWrapperProps {
  children: React.ReactNode;
}
export default function PlayerListDisplayStep({ page, setPage, apiKey, playerList, setPlayerList, slug, phaseGroups, setPhaseGroupData }: props) {

  const [keyStatus, setKeyStatus] = useState<number>(0)
  const [value, setValue] = useState<number>();
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>([]);
  const [isNextPageLoading, setIsNextPageLoading] = useState<boolean>(false)


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

    }
    else if (value <= 1 || value > playerList.length)
    {
      inputRefs.current[index].current!.value = (index + 1).toString();
      alert("please enter a value between 1 and "+playerList.length)
      
    }
    else if (value == index + 1) {
      if (inputRefs.current[index].current) {
        inputRefs.current[index].current!.value = (index + 1).toString();
      }
    }
    else {
      editSeed(value, index)
    }

  };

  const handleIconClick = async (index: number) => {
    setFocusedIndex(-1);
    if (value &&(value <= 1) ||value&& (value > playerList.length))
    {
      setValue(0)
      handleInputBlur(index)
    }
    else
    {
      handleInputBlur(index)
    }
   
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      if (inputRefs.current[index]?.current) {
        inputRefs.current[index].current!.blur();
      }

      if (!value) {
        if (inputRefs.current[index].current) {
          inputRefs.current[index].current!.value = (index + 1).toString();
        }

      }
      else if (value <= 1 || value > playerList.length)
      {
        inputRefs.current[index].current!.value = (index + 1).toString();
        
      }
      else if (value == index + 1) {
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
  var tempPlayerList: Competitor[] = playerList;
  let isLoading = true
  if (playerList.length != 0) {
    isLoading = false
  }

  //this function assigns new seeds and updates the playerList state
  async function assignSeed(playerList: Competitor[]) {

    const nextPlayerList = playerList.map((p, i) => {
      p.seed = i + 1
      return p
    });
    setPlayerList(nextPlayerList)
  }

  //this function replaces a player's seed with user input and updates everyone else's seeds accordingly
  function editSeed(newSeed: number, index: number) {

    //new seed and old seed variables to account for player list order restructuring
    //list must be sorted by seed, so all seeds change depending on the scenario
    //for example if seed 1 is sent to last seed, everyone's seed goes up by 1 etc.
    let oldSeed = playerList[index].seed
    if (newSeed > playerList.length || newSeed <= 0) {

      setKeyStatus(1)
      if (inputRefs.current[index].current) {
        inputRefs.current[index].current!.value = (index + 1).toString();
      }
      playerList[index].seed = index + 1

      return
    }
    else {

      let newPlayerList = arrayMoveImmutable(playerList, oldSeed - 1, newSeed - 1);
      assignSeed(newPlayerList)

    }
  }
  //handles the swapping of players during dragging and dropping
  async function swapCompetitors(firstPlayerIndex: number, secondPlayerIndex: number | undefined) {

    //if they get dropped outside the table don't make any changes
    if (secondPlayerIndex == undefined) {
      return tempPlayerList
    }
    //otherwise move the players
    else {
      let newPlayerList = arrayMoveImmutable(playerList, firstPlayerIndex, secondPlayerIndex);
      await assignSeed(newPlayerList)
    }

  }
  //handle submit function
  async function handleSubmit() {
    setIsNextPageLoading(true)
    let processedPhaseGroupData: phaseGroupDataInterface = await processPhaseGroups(phaseGroups!, apiKey!)
    setPhaseGroupData(processedPhaseGroupData)
    setPlayerList(await setMatchProperties(processedPhaseGroupData, playerList))
    setIsNextPageLoading(false)
    
    //data collection
    let miniSlug = slug!.replace("/event/","__").substring("tournament/".length)
    writeToFirebase('/usageData/'+auth.currentUser!.uid+"/"+miniSlug+'/preSeparationSeeding',playerList.map((c:Competitor) => c.smashggID))
    writeToFirebase('/usageData/'+auth.currentUser!.uid+"/"+miniSlug+'/skipped',false)

    setPage(page + 1)
  }

  //handle submit function
  async function skipToLast() {
    setIsNextPageLoading(true)
    let processedPhaseGroupData: phaseGroupDataInterface = await processPhaseGroups(phaseGroups!, apiKey!)
    await setPhaseGroupData(processedPhaseGroupData)
    setPlayerList(await setMatchProperties(processedPhaseGroupData, playerList))
    setIsNextPageLoading(false)
    
    //data collection
    let miniSlug = slug!.replace("/event/","__").substring("tournament/".length)
    writeToFirebase('/usageData/'+auth.currentUser!.uid+"/"+miniSlug+'/preSeparationSeeding',playerList.map((c:Competitor) => c.smashggID))
    writeToFirebase('/usageData/'+auth.currentUser!.uid+"/"+miniSlug+'/postSeparationSeeding',playerList.map((c:Competitor) => c.smashggID))
    writeToFirebase('/usageData/'+auth.currentUser!.uid+"/"+miniSlug+'/skipped',true)

    setPage(6)

  }

  ////Don't know what this does but things break if we delete them
  const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
    <span >{children}</span>
  );


  //this is where we set the headings for the dynamic table
  const createHead = (withWidth: boolean) => {
    return {
      cells: [
        {
          key: 'seed',
          content: <a className={styles.seedHead}>Seed (Edit Seed)</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        },
        {
          key: 'player',
          content: <a className={styles.tableHead}>Player</a>,
          isSortable: true,
          width: withWidth ? 15 : undefined,
        },
        {
          key: 'rating',
          content: <a className={styles.tableHead}>Rating</a>,
          shouldTruncate: true,
          isSortable: true,
          width: withWidth ? 10 : undefined,
        }
      ],
    };
  };


  //create head is set to true, so headings are created
  const head = createHead(true);

  let rating: string;
  const rows = playerList.map((player: Competitor, index: number) => ({
    key: `row-${index}-${player.tag}`,
    isHighlighted: false,
    cells: [
      {
        key: player.seed,
        content:
          <div className={styles.seedRow}>

            <div className={styles.numberInputContainer}>
              <input
                type="text"
                className={styles.numberInput}
                defaultValue={player.seed}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur(playerList.indexOf(player))}
                onKeyDown={(e) => handleKeyDown(e, (playerList.indexOf(player)))}
                onClick={() => handleInputClick(playerList.indexOf(player))}
                onFocus={() => handleInputFocus(index)}
                ref={inputRefs.current[playerList.indexOf(player)]}
              />
              <Image
                className={styles.numberInputIcon}
                src={editButton}
                alt="Edit Button"
                loading="lazy"
                onClick={() => handleIconClick(playerList.indexOf(player))}
              />
            </div>
          </div>
      },
      {
        key: createKey(player.tag),
        content: (
          <NameWrapper>
            <a className={styles.tableRow}>{player.tag}</a>
          </NameWrapper>
        ),
      },
      {
        key: player.smashggID,
        content:
          <div className={styles.tableRow}>
            {
              player.rating == 0.36 ?
                rating = player.rating.toFixed(2) + " (UNRATED)"
                :
                player.rating.toFixed(2)
            }
          </div>
      }

    ],
  }));

  //get all the buttons and put them in an array
  let buttons = document.getElementsByTagName("button");

  //function that highlights the current page
  function highLightPage(epage: number) {


    for (let i = 0; i < buttons.length - 2; i++) {
      if (i == epage) {

        buttons[i].id = styles.currentButton
      }
      else {
        buttons[i].id = ""
      }
    }
  }

  return (
    <div>

      <LoadingScreen message='Fetching data from the database. The process might take a few seconds up to a couple minutes depending on the number of entrants.' isVisible={isLoading} />
      <div>

        <div className={styles.body}>
          <h6 className={styles.headingtext}>Optional - Manually assign seeds</h6>
          {keyStatus == 0 ?
            <p></p> :
            <div className={styles.errorMessages}>
              <InlineMessage
                appearance="error"
                iconLabel={"Please enter a number between 1 and " + playerList.length}
                secondaryText={"Please enter a number between 1 and " + playerList.length}
              >

              </InlineMessage>
            </div>
          }
          <div className={styles.playerTable}>
            <DynamicTable

              head={head}
              rows={rows}
              rowsPerPage={12}
              defaultPage={1}
              onSetPage={(epage) => highLightPage(epage)}
              loadingSpinnerSize="large"
              isRankable={true}
              onRankEnd={(params) => swapCompetitors(params.sourceIndex, params.destination?.index)}
            />
          </div>
          <div className={styles.skipMessage} onClick={skipToLast}>
            <InlineMessage
              appearance="info"
              title={<div><p>If your bracket is private or you would like to avoid separating by carpool or set history, you can<a> skip to the last step by clicking here.</a> </p></div>}

            >
            </InlineMessage>
          </div>
          <div className={styles.seedingFooterContainer}>
            <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit} isDisabled={playerList.length == 0} ></SeedingFooter>
          </div>
        </div>
      </div>
    </div>


  )

}
function createKey(input: string) {
  return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}