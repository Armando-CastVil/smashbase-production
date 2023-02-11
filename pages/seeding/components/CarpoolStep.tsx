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
import { FC, Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { useState } from "react";
import { ClassAttributes, OlHTMLAttributes, LegacyRef, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, LiHTMLAttributes } from 'react';

import { Carpool } from '../types/seedingTypes';
import { Menu } from '@headlessui/react'
import Popup from "reactjs-popup";
import getSeparation from '../modules/getSeparation';
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
export default function CarpoolStep({page,setPage,apiKey,playerList,setPlayerList}:props)

{
    const [carpoolList,setCarpoolList]=useState<Carpool[]>([]);
    const [carpoolName,setCarpoolName]=useState<string|undefined>("")
    
    let playerMap = new Map<string, Competitor>();
    
    //put key value pairs in hashmap
    for(let i=0;i<playerList.length;i++)
    {
        
        let key:string|number=playerList[i].smashggID
        let value:Competitor=playerList[i]
        playerMap.set(key,value)
    }


    function addToCarpool(smashggID:string,carpool:Carpool,playerMap:Map<string, Competitor>)
    {

      let player=playerMap.get(smashggID)
      if(player!=undefined)
      {
        carpool.carpoolMembers.push(player)
        player.carpool=carpool
      }

      setCarpoolList(carpoolList.slice())

     
      
    }

    

    const handleCarpoolSubmit = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      let tempCarpoolList=carpoolList.slice();
      let tempCarpool:Carpool=
      {
        carpoolName:"test carpool",
        carpoolMembers:[]
      }
  
      tempCarpool.carpoolName=carpoolName
      tempCarpoolList.push(tempCarpool)
      
      
      setCarpoolList(tempCarpoolList)
      
      
    }
    var tempPlayerList:Competitor[]=playerList;

    async function handleSubmit()
    {
        
        setPlayerList(await getSeparation(playerList,carpoolList))
    }

    const createplayerTableHead = (withWidth: boolean) => {
        return {
          cells: [
            {
              key: 'player',
              content:<a className={styles.tableHead}>Player</a>,
              isSortable: true,
              shouldTruncate: true,
              width: withWidth ? 10 : undefined,
            },
           
            {
              key: 'Carpool',
              content:<a className={styles.tableHead}>Carpool</a>,
              shouldTruncate: true,
              isSortable: true,
              width: withWidth ? 10 : undefined,
            },
            {
                key: 'Add Carpool',
                content: <a className={styles.tableHead}>Add Carpool</a>,
                shouldTruncate: true,
                isSortable: true,
                width: withWidth ? 10 : undefined,
            }
           
          ],
        };
      };

      const createCarpoolTableHead = (withWidth: boolean) => {
        return {
          cells: [
            {
              key: 'Carpool',
              content:<a className={styles.tableHead}>Carpool</a>,
              isSortable: true,
              shouldTruncate: true,
              width: withWidth ? 10 : undefined,
            },
           
            {
              key: 'Number of Members',
              content:<a className={styles.tableHead}>Number in Carpool</a>,
              shouldTruncate: true,
              isSortable: true,
              width: withWidth ? 10 : undefined,
            },
            {
                key: 'Edit Carpool',
                content:<a className={styles.tableHead}>Edit</a>,
                shouldTruncate: true,
                isSortable: true,
                width: withWidth ? 10 : undefined,
            }
           
          ],
        };
      };

    const playerTableHead = createplayerTableHead(true);
    const  carpoolTableHead=createCarpoolTableHead(true);
    

    const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
        <span >{children}</span>
      );

    const playerRows = tempPlayerList.map((player: Competitor, index: number) => ({
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
            key: player.carpool?.carpoolName,
            content: (<NameWrapper><p className={styles.tableRow}>{player.carpool?.carpoolName}</p></NameWrapper>),
          },
          
          {
            key:player.smashggID,
            content:
            <Menu>
            <Menu.Button className={styles.carpoolButton}>Add</Menu.Button>
            <Menu.Items>
              {carpoolList.map((carpool) => (
                /* Use the `active` state to conditionally style the active item. */
                <Menu.Item key={carpool.carpoolName} as={Fragment}>
                  {({ active }) => (
                    <button className={`${
                      active ? 'bg-blue-500 text-red' : 'bg-white text-black'
                    }`} onClick={() => {

                      addToCarpool(player.smashggID,carpool,playerMap)
                      
                  }}>
                      
                      
                    
                      {carpool.carpoolName}
                      <br></br>
                    </button>
                    
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>

          }
        
        ],
      }));

      const carpoolRows = carpoolList.map((carpool: Carpool, index: number) => ({
        key: `row-${index}-${carpool.carpoolName}`,
        isHighlighted: false,
        cells: [
          {
            key: createKey(carpoolList.length.toString()),
            content: (
              <NameWrapper>
                <a href="https://atlassian.design">{carpool.carpoolName}</a>
              </NameWrapper>
            ),
          },
          {
            key: createKey(carpoolList.length.toString()),
            content: (
              <NameWrapper>
                <a href="https://atlassian.design">{carpool.carpoolMembers.length}</a>
              </NameWrapper>
            ),
          },
          
          {
            key:carpool.carpoolName,
            content:
            <Menu>
            <Menu.Button>Edit Carpool</Menu.Button>
            <Menu.Items>
              {carpoolList.map((carpool) => (
                /* Use the `active` state to conditionally style the active item. */
                <Menu.Item key={carpool.carpoolName} as={Fragment}>
                  {({ active }) => (
                    <button className={`${
                      active ? 'bg-blue-500 text-red' : 'bg-white text-black'
                    }`} onClick={() => {

                      alert("edit carpool button")
                      
                  }}>
                      
                      <br></br>
                    </button>
                    
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>

          }
        
        ],
      }));

    

      
  
    return(
      <div>
          <div className={styles.upperBody}>
            <div className={styles.bodied}>
              <h6 className={styles.headingtext}>Drag and Drop Players</h6>
              <div className={styles.flexContainer}>
                
                  <div className={styles.carpoolPlayerTable}>  
                    <DynamicTable
                      head={playerTableHead}
                      rows={playerRows}
                      rowsPerPage={10}
                      defaultPage={1}
                      loadingSpinnerSize="large"
                    />
                  </div>

                  <div className={styles.carpoolTable}>
                  
                    <Popup trigger={<button> Click to Create Carpool  </button>} 
                      position="right center">
                      <form onSubmit={handleCarpoolSubmit}>
                        <label>Enter Carpool Name:
                          <input 
                            type="text" 
                            value={carpoolName}
                            onChange={(e) => setCarpoolName(e.target.value)}
                          />
                        </label>
                        <input type="submit" />
                      </form>
                    </Popup>

                    <DynamicTable
                      head={carpoolTableHead}
                      rows={carpoolRows}
                      rowsPerPage={10}
                      defaultPage={1}
                      loadingSpinnerSize="large"
                    />

                  </div>
                
                
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


