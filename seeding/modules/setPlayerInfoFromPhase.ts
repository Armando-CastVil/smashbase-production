import Competitor from "../classes/Competitor";
import setRating from "./setRating";
import sortByRating from "./sortByRating";
//function that fills an array composed of all the competitors along with the necessary data like id,tag,rating, and bracketid
export async function setPlayerInfoFromPhase(data:any)
{
    //initialize variables
    var playerList:Competitor[]=[];
    var smashggID="";
    var bracketIDs:number[]=[]
    var tag="";

    
    

    //obtains the attributes from the data obtained from the API call and assigns them
    //to the corresponding variable  
    for(let i=0;i<data.phaseGroup.seeds.nodes.length;i++)
    {
        //obtained from api  
        smashggID=data.phaseGroup.seeds.nodes[i].players[0].id
        tag=data.phaseGroup.seeds.nodes[i].players[0].gamerTag
        bracketIDs=[];

        //initialize a Competitor object and push it in to the array
        let  entry= new Competitor(smashggID,bracketIDs,tag,0,0,"",undefined,false)
        playerList[i]=entry;
    }

    //assign ratings to each player obtained from the database
    const ratedList=await setRating(playerList)
    //sort by player
    playerList=sortByRating(ratedList)
   //set bracketIDs to the sorted list, the bracketID now corresponds to a seed
   for(let i=0;i<playerList.length;i++)
   {
    playerList[i].setSeed(i+1);
   }
   return playerList;
}//end of setPlayerInfo() function

