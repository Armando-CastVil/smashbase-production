
import { Match } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";


interface MatchStructure
{
    winners:Match[],
    losers:Match[]
}
export default function setProjectedPath(matchList:MatchStructure,playerList:Competitor[])
{
    let playerListMap = new Map<string|number,number>();

    console.log("matchlist in set projected")
    console.log(matchList)
    for(let i=0;i<playerList.length;i++)
    {
        let key:string|number=playerList[i].tag
        let value:number=i
        playerListMap.set(key,value)
    }
    console.log(playerListMap)

    //set players from projected path in Winners
    for(let i=0;i<matchList.winners.length;i++)
    {
       
        if(matchList.winners[i].competitors[0].tag=="Bye"||matchList.winners[i].competitors[1].tag=="Bye")
        {
            i++
        }    
        else
        {
            playerList[playerListMap.get(matchList.winners[i].competitors[0].tag)!].addPlayerToPath(playerList[playerListMap.get(matchList.winners[i].competitors[1].tag)!])
            playerList[playerListMap.get(matchList.winners[i].competitors[1].tag)!].addPlayerToPath(playerList[playerListMap.get(matchList.winners[i].competitors[0].tag)!])
        }
        
    }

     //set players from projected path in losers
     for(let i=0;i<matchList.losers.length;i++)
     {
        if(matchList.losers[i].competitors.length!=2)
        {
            i++
        }
        if(matchList.losers[i].competitors[0].tag=="Bye"||matchList.losers[i].competitors[1].tag=="Bye")
        {
            i++
        }    
        else
        {
            playerList[playerListMap.get(matchList.losers[i].competitors[0].tag)!].addPlayerToPath(playerList[playerListMap.get(matchList.losers[i].competitors[1].tag)!])
            playerList[playerListMap.get(matchList.losers[i].competitors[1].tag)!].addPlayerToPath(playerList[playerListMap.get(matchList.losers[i].competitors[0].tag)!])
        }
         
     }

     console.log("set projected pl")
     console.log(playerList)
     return playerList
}