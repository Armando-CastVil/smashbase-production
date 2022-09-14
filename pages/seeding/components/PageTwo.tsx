
import { Carpool } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import styles from '/styles/Home.module.css'
import DisplayCompetitorList from "./DisplayCompetitorList";
import { useEffect } from "react";
import CarpoolDisplay from "./CarpoolDisplay";
import getSeparation from "../modules/getSeparation";
import assignBracketIds from "../modules/assignBracketIds";
import getMatchList from "../modules/getMatchList";
import setProjectedPath from "../modules/setProjectedPath";


interface props {
    
    playerList: Competitor[];
    carpoolList: Carpool[];
    addPlayerToCarpool:(player:Competitor)=>void;
    updateSelectedCarpool: (arg: Carpool) => void
    updateCompetitorList: (arg: Competitor[]) => void
    
    
}

export default function PageTwo({playerList,carpoolList,addPlayerToCarpool,updateSelectedCarpool,updateCompetitorList}:props)
{

   

    //handles the submission button for page two
    const handlePageTwoSubmit= async (event: { preventDefault: () => void; })  => 
    {
        let tempPlayerList:Competitor[]=[];
        tempPlayerList=await getSeparation(playerList, carpoolList)
        tempPlayerList=assignBracketIds(apiData,playerList)
        let tempMatchList=await getMatchList(apiData,tempPlayerList)

        tempPlayerList=setProjectedPath(tempMatchList,tempPlayerList)
        tempPlayerList=await getSeparation(playerList, carpoolList)
        setPlayerList(setProjectedPath(tempMatchList,tempPlayerList))
        setPage(3)
    }
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


