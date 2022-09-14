
import { Carpool, Match } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import styles from '/styles/Home.module.css'
import DisplayCompetitorList from "./DisplayCompetitorList";
import { useEffect, useState } from "react";
import CarpoolDisplay from "./CarpoolDisplay";
import getSeparation from "../modules/getSeparation";
import assignBracketIds from "../modules/assignBracketIds";
import getMatchList from "../modules/getMatchList";
import setProjectedPath from "../modules/setProjectedPath";

//interface for the list of matches we will pass to the bracket display component
interface MatchStructure
{
    winners:Match[],
    losers:Match[]
}
interface props {
    
    playerList: Competitor[];
    carpoolList: Carpool[];
    apiData:any;
    matchList:MatchStructure|undefined;
    addPlayerToCarpool:(player:Competitor)=>void;
    updateSelectedCarpool: (arg: Carpool) => void
    updateCompetitorList: (arg: Competitor[]) => void
    updatePage:(arg:number)=>void
    
    
    
}

export default function PageTwo({playerList,carpoolList,apiData,matchList,addPlayerToCarpool,updateSelectedCarpool,updateCompetitorList, updatePage}:props)
{

    const [pList,setpList]=useState<Competitor[]>(playerList)
    const [mList,setMatchList]=useState<MatchStructure>()







    //handles the submission button for page two
    const handlePageTwoSubmit= async (event: { preventDefault: () => void; })  => 
    {

       /* let tempPlayerList:Competitor[]=[];
        tempPlayerList=assignBracketIds(apiData,playerList)
        let tempMatchList=await getMatchList(apiData,tempPlayerList)
        tempPlayerList=setProjectedPath(tempMatchList,tempPlayerList)
        tempPlayerList=await getSeparation(playerList, carpoolList)
        tempPlayerList=assignBracketIds(apiData,playerList)
        tempMatchList=await getMatchList(apiData,tempPlayerList)
        tempPlayerList=setProjectedPath(tempMatchList,tempPlayerList)
        setpList(tempPlayerList)
       */
    
        let tempPlayerList=await getSeparation(playerList,carpoolList)
        let tempMatchList=await getMatchList(apiData,pList)
        tempPlayerList=setProjectedPath(tempMatchList,pList)
        setpList(tempPlayerList)
        console.log(pList)
        setMatchList(tempMatchList)
        updatePage(3)
    }
    return(
        <div>
            {playerList==undefined?
            <h3>loading...</h3>
            :
            <div>
                <button className={styles.button}  onClick={e => { handlePageTwoSubmit(e) }}>Proceed to manual swapping</button>
                <DisplayCompetitorList playerList={playerList} carpoolList={carpoolList} updateSelectedCarpool={updateSelectedCarpool} addPlayerToCarpool={addPlayerToCarpool}/>
                <CarpoolDisplay cList={carpoolList} pList={playerList} setPlayerFromButton={function (player: Competitor): void {
                        
                } }/>
            </div>
           
            }
        </div>
    )
}


