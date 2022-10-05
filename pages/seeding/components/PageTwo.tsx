import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { Carpool } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import PlayerDragAndDrop from "./PlayerDragAndDrop";

import styles from '/styles/Home.module.css'
import DisplayProjectedPath from "./DisplayProjectedPath";
interface props {
    pList: Competitor[]; 
    updatePage:(arg:number)=>void
}



export default function PageTwo({pList, updatePage}:props)
{

    
    const [carpool,setCarpool]=useState<Carpool>()
    const [player,setPlayer]=useState<Competitor>()
    const [playerList,setPlayerList]=useState<Competitor[]>()
    
    let playerListMap = new Map<string|number,number>();
    for(let i=0;i<pList.length;i++)
    {
        let key:string|number=pList[i].tag
        let value:number=i
        playerListMap.set(key,value)
    }

    let playerSwap:Competitor[]=[];

     //handles the submission button for page two
     const handlePageTwoSubmit= async (event: { preventDefault: () => void; })  => 
     {
 
         updatePage(3)
     }

    function handleSwap(e:Competitor) {
        playerSwap?.push(e)
        console.log("playerswap length is:"+ playerSwap.length)
        if(playerSwap?.length==2)
        {
            
            [pList[playerListMap.get(playerSwap[0].tag)!],pList[playerListMap.get(playerSwap[1].tag)!]]=[pList[playerListMap.get(playerSwap[1].tag)!],pList[playerListMap.get(playerSwap[0].tag)!]]
            /*let tempPlayer1:Competitor=JSON.parse(JSON.stringify(playerSwap[0]))
            let tempPlayer2:Competitor=JSON.parse(JSON.stringify(playerSwap[1]))
            pList[playerListMap.get(tempPlayer2.tag)!]=tempPlayer1
            pList[playerListMap.get(tempPlayer1.tag)!]=tempPlayer2
            console.log("swapping "+tempPlayer1.tag+" with "+tempPlayer2.tag)
           */
            playerSwap.pop()
            playerSwap.pop()
            setPlayerList(pList)

        }
    }
    


    return(
        <div >
            <button className={styles.button}  onClick={e => { handlePageTwoSubmit(e) }}>Proceed to carpools</button>
            <PlayerDragAndDrop pList={pList}/>
        </div>
    )
        
}
