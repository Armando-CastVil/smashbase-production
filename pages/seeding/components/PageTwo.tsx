
import { Carpool } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import styles from '/styles/Home.module.css'
import DisplayCompetitorList from "./DisplayCompetitorList";
import { useEffect } from "react";
import CarpoolDisplay from "./CarpoolDisplay";


interface props {
    
    playerList: Competitor[];
    carpoolList: Carpool[];
    addPlayerToCarpool:(player:Competitor)=>void;
    updateSelectedCarpool: (arg: Carpool) => void
    
    
}

export default function PageTwo({playerList,carpoolList,addPlayerToCarpool,updateSelectedCarpool}:props)
{

   

    
    return(
        <div>
            {playerList==undefined?
            <h3>loading...</h3>
            :
            <div>

             
                <DisplayCompetitorList playerList={playerList} carpoolList={carpoolList} updateSelectedCarpool={updateSelectedCarpool} addPlayerToCarpool={addPlayerToCarpool}/>
                <CarpoolDisplay cList={carpoolList} pList={playerList} setPlayerFromButton={function (player: Competitor): void {
                        
                        } }/>
            </div>
           
            }
        </div>
    )
}


