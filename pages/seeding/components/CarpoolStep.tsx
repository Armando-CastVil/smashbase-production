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
import { useState } from "react";
import { ClassAttributes, OlHTMLAttributes, LegacyRef, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, LiHTMLAttributes } from 'react';
import CarpoolForm from './CarpoolForm';
import { Carpool } from '../types/seedingTypes';

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
export default function CarpoolStep({page,setPage,apiKey,playerList,setPlayerList}:props)

{
    const [carpoolList,setCarpoolList]=useState<Carpool[]>([])
    var tempPlayerList:Competitor[]=playerList;

    function allOnClickEvents()
    {
        setPage(page + 1);
        setPlayerList(tempPlayerList)
    }

    const createHead = (withWidth: boolean) => {
        return {
          cells: [
            {
              key: 'player',
              content: 'Player',
              isSortable: true,
              width: withWidth ? 15 : undefined,
            },
            {
              key: 'powerlvl',
              content: 'Rating',
              shouldTruncate: true,
              isSortable: true,
              width: withWidth ? 10 : undefined,
            },
          ],
        };
      };

    const head = createHead(true);
    function createKey(input: string) {
        return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
      }

    const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
        <span >{children}</span>
      );

    const rows = tempPlayerList.map((player: Competitor, index: number) => ({
        key: `row-${index}-${player.tag}`,
        isHighlighted: false,
        cells: [
          {
            key: createKey(player.tag),
            content: (
              <NameWrapper>
                <a href="https://atlassian.design">{player.tag}</a>
              </NameWrapper>
            ),
          },
          {
            key: player.smashggID,
            content: player.rating,
          },
        ],
      }));

    

      
  
    return(
        <div>
            
            <CarpoolForm carpoolList={carpoolList} setCarpoolList={setCarpoolList} />
            <button
                    onClick={() => {

                        allOnClickEvents()
                        
                    }}>
                Next
                </button>
            <DynamicTable
            head={head}
            rows={rows}
            rowsPerPage={10}
            defaultPage={1}
            loadingSpinnerSize="large"
            
            />

        {carpoolList.map((c: Carpool) =>{
          return <>
             
            <div key={c.carpoolName}  >
              <h3  >{c.carpoolName}</h3> 
            </div>
            <br/>
          </>
        })}

        <h3>{carpoolList.length}</h3>




        </div>
           
  
    )
    
}


