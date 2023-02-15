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
import { FC, useState } from 'react';




import { ClassAttributes, OlHTMLAttributes, LegacyRef, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, LiHTMLAttributes } from 'react';
import SeedingFooter from './SeedingFooter';
import processPhaseGroups from '../modules/processPhaseGroups';
import setMatchProperties from '../modules/setMatchProperties';
import css from 'styled-jsx/css';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    playerList:Competitor[];
    setPlayerList:(competitors:Competitor[]) => void;
    slug:string|undefined;
    phaseGroups:number[]|undefined;

    
}

interface NameWrapperProps {
    children: React.ReactNode;
}
export default function PlayerListDisplayStep({page,setPage,apiKey,playerList,setPlayerList,slug,phaseGroups}:props)
{

   
    const [playerPage, setPlayerPage] = useState<number>(1);
    var tempPlayerList:Competitor[]=playerList;
    function swapCompetitors(firstPlayerIndex:number,secondPlayerIndex:number|undefined)
        {
            if(secondPlayerIndex==undefined)
            {
                
                return tempPlayerList
            }
            else
            {
                var tempPlayer1:Competitor= JSON.parse(JSON.stringify(tempPlayerList[firstPlayerIndex]))
                var tempPlayer2:Competitor= JSON.parse(JSON.stringify(tempPlayerList[secondPlayerIndex]))
                tempPlayerList[secondPlayerIndex]=tempPlayer1
                tempPlayerList[firstPlayerIndex]=tempPlayer2
            }
            
        }
      async function handleSubmit()
        {
            
          setPlayerList(await setMatchProperties(await processPhaseGroups(phaseGroups!,apiKey!),playerList))
            
        }
    const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
        <span >{children}</span>
      );
    
  

      const createHead = (withWidth: boolean) => {
        return {
          cells: [
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
            },
            {
              key: 'seed',
              content: <a className={styles.tableHead}>Seed</a>,
              shouldTruncate: true,
              isSortable: true,
              width: withWidth ? 10 : undefined,
            }
          ],
        };
      };

      const head = createHead(true);

      const rows = tempPlayerList.map((player: Competitor, index: number) => ({
        key: `row-${index}-${player.tag}`,
        isHighlighted: false,
        cells: [
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
            content: <a className={styles.tableRow}>{player.rating.toFixed(2)}</a>,
          },
          {
            key: player.seed,
            content: <a className={styles.tableRow}>{playerList.indexOf(player)+1}</a>,
          }
        ],
      }));
      
      
      //put the first page in to the purple div//

      //get all the buttons and put them in an array
      let buttons = document.getElementsByTagName("button");
      buttons[1].id=styles.currentButton

      
      

      function highlightPage(epage:number)
      {
        
     

        
        
        for(let i=0;i<buttons.length-2;i++)
        {
          if(i==epage)
          {
            console.log(epage)
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
              <h6 className={styles.headingtext}>Drag and Drop Players</h6>
              <div className={styles.tourneyTable}>
                <DynamicTable
                
                head={head}
                rows={rows}
                rowsPerPage={10}
                defaultPage={1}
            
                onSetPage={(epage)=>highlightPage(epage)}
                loadingSpinnerSize="large"
                isRankable={true}
                onRankStart={(params) => console.log('onRankStart', params.index)}
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


