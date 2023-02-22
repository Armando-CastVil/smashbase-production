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
import { Carpool } from '../seedingTypes';
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

////Don't know what this does but things break if we delete them
interface NameWrapperProps {
    children: React.ReactNode;
  }

export default function CarpoolStep({page,setPage,apiKey,playerList,setPlayerList}:props)
{
  //hook states where we will store the carpools and the name of the current carpool being created
  const [carpoolList,setCarpoolList]=useState<Carpool[]>([]);
  const [carpoolName,setCarpoolName]=useState<string|undefined>("")

  //hashmap so we can retrieve players by their smashgg ids
  let playerMap = new Map<string, Competitor>();
  
  //put key value pairs in hashmap
  for(let i=0;i<playerList.length;i++)
  {
    let key:string|number=playerList[i].smashggID
    let value:Competitor=playerList[i]
    playerMap.set(key,value)
  }


  //this function adds a player to a carpool
  function addToCarpool(smashggID:string,carpool:Carpool,playerMap:Map<string, Competitor>)
  {

    let player=playerMap.get(smashggID)
    //this is to remove a player from another carpool if theyre already in one
    if(player!.carpool!=undefined)
    {
      for(let i=0;i<carpoolList.length;i++)
      {
        if(carpoolList[i].carpoolName==player!.carpool.carpoolName)
        {
          for(let j=0;j<carpoolList[i].carpoolMembers.length;j++)
          {
            if(carpoolList[i].carpoolMembers[j].smashggID==player!.smashggID)
            {
              carpoolList[i].carpoolMembers.splice(j, 1);
            }
          }
        }
      }
    }
    if(player!=undefined)
    {
      carpool.carpoolMembers.push(player)
      player.carpool=carpool
    }

    setCarpoolList(carpoolList.slice())

  }


  //function that removes a player from a carpool and sets that player's carpool attribute to undefined
  function removeFromCarpool(smashggID: string,carpoolToChange:Carpool) 
  {
    const nextCarpoolList = carpoolList.map((carpool) => 
    {
      if(carpool.carpoolName==carpoolToChange.carpoolName)
      {
        for(let i=0;i<carpool.carpoolMembers.length;i++)
        {
          if(carpool.carpoolMembers[i].smashggID==smashggID)
          {
            playerMap.get(smashggID)!.carpool=undefined
            carpool.carpoolMembers.splice(i,1)
            
          }
        }
      }
      return carpool
    });
  setCarpoolList(nextCarpoolList)
  }
    

  //handles the creation of a new carpool, not to be confused with handling submission of this step
  const handleCarpoolSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    let tempCarpoolList=carpoolList.slice();
    let tempCarpool:Carpool=
    {
      carpoolName:"test carpool",
      carpoolMembers:[]
    }
    for(let i=0;i<tempCarpoolList.length;i++)
    {
      if(tempCarpoolList[i].carpoolName==carpoolName)
      {
        alert("there is already carpool with that name")
        return
      }
    }

    tempCarpool.carpoolName=carpoolName
    tempCarpoolList.push(tempCarpool)
    
    setCarpoolList(tempCarpoolList)
  }

  //variable to hold a copy of the list of players. please fix later
  var tempPlayerList:Competitor[]=playerList;

  //this step's submit function calls the separation function and updates the player list
  async function handleSubmit()
  {
      
      setPlayerList(await getSeparation(playerList,carpoolList))
      setPage(page+1)
  }

  //this creates the headings for the player list dynamic table
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
              content: <a className={styles.tableHead}>Add to Carpool</a>,
              shouldTruncate: true,
              isSortable: true,
              width: withWidth ? 10 : undefined,
          }
          
        ],
      };
    };

  //this creates the headings for the carpool list dynamic table
  const createCarpoolTableHead = (withWidth: boolean) => {
    return {
      cells: [
        {
          key: 'Carpool',
          content:<a className={styles.tableHead}>Carpool Name</a>,
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
            content:<a className={styles.tableHead}>Remove Members</a>,
            shouldTruncate: true,
            isSortable: true,
            width: withWidth ? 10 : undefined,
        }
        
      ],
    };
  };

  //this sets the create heading functions to true
  const playerTableHead = createplayerTableHead(true);
  const  carpoolTableHead=createCarpoolTableHead(true);
    
  ////Don't know what this does but things break if we delete them
  const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
      <span >{children}</span>
    );

  //this is where the rows for the player list dynamic table are set
  const playerRows = tempPlayerList.map((player: Competitor, index: number) => ({
      key: `row-${index}-${player.tag}`,
      isHighlighted: false,
      cells: [
        {
          key: createKey(player.tag),
          content: (
            <NameWrapper>
              <p className={styles.tableRow}>{player.tag}</p>
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
          <Menu.Button className={styles.carpoolButton}>
            +
          </Menu.Button>
          <Menu.Items className={styles.menuItem}>
            {carpoolList.map((carpool) => (
              <div>
              <Menu.Item key={carpool.carpoolName} as={Fragment}>
                {({ active }) => (
                  <button className={styles.menuItem} onClick={() => {
                    addToCarpool(player.smashggID,carpool,playerMap)   
                }}>
                    
                    {carpool.carpoolName}
                    
                  </button>
                    
                )}
              </Menu.Item>
              <br></br>
              </div>
            ))}
          </Menu.Items>
        </Menu>

        }
      
      ],
    }));

  //this is where the rows for the carpool list dynamic table are set
  const carpoolRows = carpoolList.map((carpool: Carpool, index: number) => ({
    key: `row-${index}-${carpool.carpoolName}`,
    isHighlighted: false,
    cells: [
      {
        key: createKey(carpoolList.length.toString()),
        content: (
          <NameWrapper>
            <p>{carpool.carpoolName}</p>
          </NameWrapper>
        ),
      },
      {
        key: createKey(carpoolList.length.toString()),
        content: (
          <NameWrapper>
            <p>{carpool.carpoolMembers.length}</p>
          </NameWrapper>
        ),
      },
      
      {
        key:carpool.carpoolName,
        content:
        <Menu>
        <Menu.Button className={styles.removeButton}>-</Menu.Button>
        <Menu.Items className={styles.menuItem}>
          {carpool.carpoolMembers.map((player) => (
            /* Use the `active` state to conditionally style the active item. */
            <div>
            <Menu.Items   key={player.smashggID} as={Fragment}>
              {({ }) => (
                <button className={styles.menuItem} onClick={()=>
                  {
                    removeFromCarpool(player.smashggID,carpool)
                  }}>
                  {player.tag}
                  <br></br>
                </button>
                
              )}
            </Menu.Items>
            <br></br>
            </div>
          ))}
        </Menu.Items>
      </Menu>

      }
    
    ],
  }));

    

      
  //return function
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
                    rowsPerPage={playerList.length}
                    defaultPage={1}
                    loadingSpinnerSize="large"
                  />
                </div>

                <div className={styles.carpoolTable}>
                
                 

                  <DynamicTable
                    head={carpoolTableHead}
                    rows={carpoolRows}
                    rowsPerPage={10}
                    defaultPage={1}
                    loadingSpinnerSize="large"
                  />
                   <Popup trigger={<button className={styles.addCarpoolButton}> Click to Create Carpool  </button>} 
                    position="bottom left" closeOnEscape={true} closeOnDocumentClick={true} >
                    <form onSubmit={handleCarpoolSubmit}>
                      <label className={styles.labelMessage}>Enter Carpool Name:
                        <input 
                          type="text" 
                          value={carpoolName}
                          onChange={(e) => setCarpoolName(e.target.value)}
                        />
                      </label>
                      <input type="submit" />
                    </form>
                  </Popup>

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


