
import Competitor from "../classes/Competitor"



export default function assignBracketIds(data:any,playerList:Competitor[])
{

    console.log("assign bracket ids data:")
    console.log(data)

    
   for(let i=0;i<data.phaseGroup.seeds.nodes.length;i++)
   {
    
    playerList[i].bracketID=data.phaseGroup.seeds.nodes[i].id
   }
    
    return playerList
}
