
import { Match } from "../seedingTypes";
import Competitor from "../classes/Competitor";



export default function setProjectedPath(matchList:Match[],playerList:Competitor[])
{
    
    //hashmap for playerlist
    let playerListMap = new Map<string|number,number>();
    //fill in the hashmap
    for(let i=0;i<playerList.length;i++)
    {
        let key:string|number=playerList[i].smashggID
        let value:number=i
        playerList[i].projectedPath=[];
        playerListMap.set(key,value)
    }
    

    //set players in to their opponents' projected paths
    for(let i=0;i<matchList.length;i++)
    {
        
        //get the index of the first player
        let player1Index=playerListMap.get(matchList[i].competitors[0].smashggID)

        //make a copy of the first player
        let player1Copy:Competitor=JSON.parse(JSON.stringify(playerList[player1Index!])) 
        player1Copy.projectedPath=[]

        //get index of the second player
        let player2Index=playerListMap.get(matchList[i].competitors[1].smashggID)

        //make a copy of the second player
        let player2Copy:Competitor=JSON.parse(JSON.stringify(playerList[player2Index!])) 
        player2Copy.projectedPath=[]

        //push the 2nd player in to the 1st player's projected path
        playerList[player1Index!].addPlayerToPath(player2Copy)
        //push the 1st player in to the 2nd player's projected path
        playerList[player2Index!].addPlayerToPath(player1Copy)
        

    }

  
     return playerList
}