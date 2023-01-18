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
import { FC } from 'react';
import { css, jsx } from '@emotion/react';



import { ClassAttributes, OlHTMLAttributes, LegacyRef, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, LiHTMLAttributes } from 'react';
import SeedingFooter from './SeedingFooter';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    playerList:Competitor[];
    setPlayerList:(competitors:Competitor[]) => void;
    
}

interface NameWrapperProps {
    children: React.ReactNode;
}
export default function PlayerListDisplayStep({page,setPage,apiKey,playerList,setPlayerList}:props)
{

    var tempPlayerList:Competitor[]=playerList;
    function swapCompetitors(firstPlayerIndex:number,secondPlayerIndex:number|undefined)
        {
            if(secondPlayerIndex==undefined)
            {
                console.log("swap function player list")
                return tempPlayerList
            }
            else
            {
                var tempPlayer1:Competitor= JSON.parse(JSON.stringify(tempPlayerList[firstPlayerIndex]))
                var tempPlayer2:Competitor= JSON.parse(JSON.stringify(tempPlayerList[secondPlayerIndex]))
                tempPlayerList[secondPlayerIndex]=tempPlayer1
                tempPlayerList[firstPlayerIndex]=tempPlayer2
            }
            console.log("temp player list after swapping:")
            console.log(tempPlayerList)
        }
        function allOnClickEvents()
        {
            setPage(page + 1);
            setPlayerList(tempPlayerList)
        }
    const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
        <span >{children}</span>
      );
    
    const nameWrapperStyles = css({
        display: 'flex',
        alignItems: 'center',
    });
     

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
              key: 'powerlvl',
              content: <a className={styles.tableHead}>Rating</a>,
              shouldTruncate: true,
              isSortable: true,
              width: withWidth ? 10 : undefined,
            },
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
        ],
      }));
      
   
     
      
      
    return(
        <div>
          <div className={styles.upperBody}>
            <div className={styles.bodied}>
              <h6 className={styles.headingtext}>Drag and Drop Players</h6>
              <div className={styles.tourneyTable}>
                <DynamicTable
                head={head}
                rows={rows}
                rowsPerPage={25}
                defaultPage={1}
            
                loadingSpinnerSize="large"
                isRankable={true}
                onRankStart={(params) => console.log('onRankStart', params.index)}
                onRankEnd={(params) => swapCompetitors(params.sourceIndex,params.destination?.index)}
                />
              </div>
              <SeedingFooter page={page} setPage={setPage}  ></SeedingFooter>
            </div>
          </div>

        </div>
           
  
    )
    
}

function createKey(input: string) {
    return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}
const nameWrapperStyles = css({
    display: 'flex',
    alignItems: 'center',
    
});
