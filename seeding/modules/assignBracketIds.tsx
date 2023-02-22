
import Competitor from "../classes/Competitor"

interface phaseGroupDataInterface
{
    
    phaseIDs:number[];
    phaseIDMap:Map<number, number[]>;
    sets:any[];
}

//data is an unprocessed object that includes an array of bracketIDs which need to be assigned to a player
export default function assignBracketIds(phaseGroupData:phaseGroupDataInterface,playerList:Competitor[])
{

    
   for(let i=0;i<phaseGroupData.phaseIDs.length;i++)
   {
        let seedArray=phaseGroupData.phaseIDMap.get(phaseGroupData.phaseIDs[i])
        
        for(let j=0;j<seedArray!.length;j++)
        {
            playerList[j].bracketIDs[i]=seedArray![j]
        }
        
   }
    
    return playerList
}
