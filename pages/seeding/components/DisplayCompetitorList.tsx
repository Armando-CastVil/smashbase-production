
import { useState } from "react";
import { Carpool } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import AddToCarpoolButton from "./AddToCarpoolButton";
import CarpoolDropDownMenu from "./CarpoolDropDownMenu";
import styles from '/styles/Home.module.css'
import DisplayProjectedPath from "./DisplayProjectedPath";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
interface props {
    
    playerList: Competitor[];
    carpoolList: Carpool[];
    updateSelectedCarpool: (arg: Carpool) => void
    addPlayerToCarpool:(player:Competitor)=>void;
}

interface CarpoolDropDownMenuProps {
    carpoolList: Carpool[],
    updateSelectedCarpool: (arg: Carpool) => void
}
interface buttonProps
{
    player:Competitor;
    addPlayerToCarpool:(arg:Carpool,player:Competitor)=>void;

}

export default function DisplayCompetitorList({playerList,carpoolList,updateSelectedCarpool,addPlayerToCarpool}:props)
{

    

    //const [playerList,setPlayerList]=useState<Competitor[]>()
    
    let playerListMap = new Map<string|number,number>();
    for(let i=0;i<playerList.length;i++)
    {
        let key:string|number=playerList[i].tag
        let value:number=i
        playerListMap.set(key,value)
    }

    let playerSwap:Competitor[]=[];

    function handleSwap(e:Competitor) {
        playerSwap?.push(e)
        console.log("playerswap length is:"+ playerSwap.length)
        if(playerSwap?.length==2)
        {
            
            let tempPlayer1=JSON.parse(JSON.stringify(playerSwap[0]))
            let tempPlayer2=JSON.parse(JSON.stringify(playerSwap[1]))
            playerList[playerListMap.get(tempPlayer2.tag)!]=tempPlayer1
            playerList[playerListMap.get(tempPlayer1.tag)!]=tempPlayer2
            console.log("swapping "+tempPlayer1.tag+" with "+tempPlayer2.tag)
            //setPlayerList(playerList)

        }
    }

    const grid = 8;

    const PlayerItem =`
    width: 200px;
    border: 1px solid grey;
    margin-bottom: ${grid}px;
    background-color: lightblue;
    padding: ${grid}px;
    `;

    function onDragEnd(result:any) {
        if (!result.destination) {
          return;
        }
        if (result.destination.index === result.source.index) {
            return;
          }
    }
    const reorder = (list:Competitor[], startIndex:number, endIndex:number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
      };
    


    return(
        <div  >
          {
          
            playerList.map((e:Competitor)=>
             <>
             <div className={styles.list}  key={e.smashggID.toString() }>
               <h3>{playerList.indexOf(e)+1}</h3>
                 <h3>Tag: {e.tag}</h3>
                 <h3>Rating: {e.rating.toFixed(2)}</h3>
                 <h3>carpool:{e.carpool?.carpoolName}</h3>  
                 <CarpoolDropDownMenu carpoolList={carpoolList} updateSelectedCarpool={updateSelectedCarpool}/>
                 <AddToCarpoolButton player={e} addPlayerToCarpool={addPlayerToCarpool}/>
                 <DisplayProjectedPath playerList={e.projectedPath}/>
             </div>
             <br></br>
             </>
             )
   
          }
          
            
        </div>
    )
        
}
