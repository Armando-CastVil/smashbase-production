import Image from 'next/image';
import styles from '/styles/Seeding.module.css'
import Tournament from '../classes/Tournament';
import Event from '../classes/TourneyEvent';
import axios from 'axios';
import TourneyEvent from '../classes/TourneyEvent';
import getBracketData from '../modules/getBracketData';
import { setPlayerInfoFromPhase } from '../modules/setPlayerInfoFromPhase';
import assignBracketIds from '../modules/assignBracketIds';
import getMatchList from '../modules/getMatchList';
import setProjectedPath from '../modules/setProjectedPath';
import Competitor from '../classes/Competitor';
import DynamicTable from '@atlaskit/dynamic-table';
import editButton  from "assets/seedingAppPics/editButton.png"
import { FC, useState } from 'react';
import {arrayMoveImmutable} from 'array-move';
interface phaseGroupDataInterface
{
    
    phaseIDs:number[];
    phaseIDMap:Map<number, number[]>;
    seedIDMap:Map<number|string, number>;
    sets:any[];
}

import { ClassAttributes, OlHTMLAttributes, LegacyRef, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, LiHTMLAttributes } from 'react';
import SeedingFooter from './SeedingFooter';
import processPhaseGroups from '../modules/processPhaseGroups';
import setMatchProperties from '../modules/setMatchProperties';
import css from 'styled-jsx/css';
import sortByRating from '../modules/sortByRating';

//props passed from previous step
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    playerList:Competitor[];
    setPlayerList:(competitors:Competitor[]) => void;
    slug:string|undefined;
    phaseGroups:number[]|undefined;
    setPhaseGroupData:(phaseGroupData: phaseGroupDataInterface) => void;
    
    
}

//Don't know what this does but things break if we delete them
interface NameWrapperProps {
    children: React.ReactNode;
}
export default function PlayerListDisplayStep({page,setPage,apiKey,playerList,setPlayerList,slug,phaseGroups,setPhaseGroupData}:props)
{

 
  //this is the array where we will store all the comptetitors
  var tempPlayerList:Competitor[]=playerList;
  let isLoading=true
  if(playerList.length!=0)
  {
    isLoading=false
  }


  //this function assigns new seeds and updates the playerList state
  async function assignSeed(playerList:Competitor[])
  {

    const nextPlayerList = playerList.map((p, i) => 
    {
      p.seed=i+1
      return p
    });

 
  setPlayerList(nextPlayerList)
  
  }

  //this function replaces a player's seed with user input and updates everyone else's seeds accordingly
  async function editSeed(e:any,index:number)
  {
    
    
    //new seed and old seed variables to account for player list order restructuring
    //list must be sorted by seed, so all seeds change depending on the scenario
    //for example if seed 1 is sent to last seed, everyone's seed goes up by 1 etc.
    let newSeed=parseInt(e.target.value)
    let oldSeed=playerList[index].seed
    
    if (e.key === "Enter")
    {
      if(newSeed>playerList.length||newSeed<=0)
      {
        alert("set a seed between 1 and "+playerList.length)
        playerList[index].seed=index+1
        return
      }
      else
      {
        
        let newPlayerList=arrayMoveImmutable(playerList, oldSeed-1, newSeed-1);
        console.log(oldSeed)
        console.log(newSeed)
        assignSeed(newPlayerList)

      }
      
    }
  }
  //handles the swapping of players during dragging and dropping
  async function swapCompetitors(firstPlayerIndex:number,secondPlayerIndex:number|undefined)
  {

    //if they get dropped outside the table don't make any changes
    if(secondPlayerIndex==undefined)
    {
      return tempPlayerList
    }
    //otherwise move the players
    else
    {
      let newPlayerList=arrayMoveImmutable(playerList, firstPlayerIndex, secondPlayerIndex);
      await assignSeed(newPlayerList)
    }
      
  }
  //handle submit function
  async function handleSubmit()
  {
    let processedPhaseGroupData:phaseGroupDataInterface=await processPhaseGroups(phaseGroups!,apiKey!)
    console.log("ppgd")
    console.log(processedPhaseGroupData)
    setPhaseGroupData(processedPhaseGroupData)
    setPlayerList(await setMatchProperties(processedPhaseGroupData,playerList))
    setPage(page+1)
      
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

  let rating:string;
  const rows = playerList.map((player: Competitor, index: number) => ({
    key: `row-${index}-${player.tag}`,
    isHighlighted: false,
    cells: [
      {
        key: player.seed,
        content: 
          <div className={styles.seedRow}>
            <div className={styles.editSeed}  onClick={() => console.log(player.seed)}>
      
              <input
                type="text"
                defaultValue={player.seed}
                className={styles.textInput}
                onKeyDown={e=>editSeed(e,playerList.indexOf(player))}
                
              />
              <Image src={editButton} alt="Edit Button" width="15" height="15" loading="lazy"></Image>
            </div>
            
          </div>,
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
            player.rating==0.125?
            rating=player.rating.toFixed(2)+" (UNRATED)"
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
  function highLightPage(epage:number)
  {
    

    for(let i=0;i<buttons.length-2;i++)
    {
      if(i==epage)
      {
        
        buttons[i].id=styles.currentButton
      }
      else
      {
        buttons[i].id=""
      }
    }
  }
     
      
      
  return(
      <div>
        <div className={styles.upperBody}>
          <div className={styles.bodied}>
            <h6 className={styles.headingtext}>Optional - Manually assign seeds</h6>
            <div className={styles.playerTable}>
              <DynamicTable
              
              head={head}
              rows={rows}
              rowsPerPage={12}
              defaultPage={1}
              isLoading={isLoading}
              onSetPage={(epage)=>highLightPage(epage)}
              loadingSpinnerSize="large"
              isRankable={true}
              onRankEnd={(params) => swapCompetitors(params.sourceIndex,params.destination?.index)}
              />
            </div>
            
            <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit}  ></SeedingFooter>
          </div>
        </div>

      </div>
          

  )
    
}

function createKey(input: string) {
    return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}
function sortBySeed(entryList:Competitor[]):Competitor[]
{
const sortedList=entryList.sort((entry1,entry2)=>(entry1.seed>entry2.seed)? 1 :(entry1.seed<entry2.seed) ?-1:0);
return sortedList
}