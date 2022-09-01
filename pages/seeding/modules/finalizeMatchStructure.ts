import { Match } from "../types/seedingTypes";

//interface for the object we will be returning
interface MatchStructure
{
    winners:Match[],
    losers:Match[]
}
//place the sets that will be displayed in the final match structure
export default function finalizeMatchStructure(setList:Match[],data:any,matchList:MatchStructure)
{
    
    let dataListMap = new Map<string|number,number>();
     //put key value pairs in hashmap
     for(let i=0;i<data.phaseGroup.sets.nodes.length;i++)
     {
         
         let key:string|number=data.phaseGroup.sets.nodes[i].id
         let value:number=i
         dataListMap.set(key,value)
     }

    //remove the sets without any info
    for(let i=0;i<setList.length;i++)
    {
        
        if(setList[i].nextWinnersMatchId==undefined||null && setList[i].nextLosersMatchId==undefined||null)
        {
            
            setList.splice(i,1)
            i--
        }


        else if(data.phaseGroup.sets.nodes[dataListMap.get(setList[i].id)!].slots[0].prereqType=='bye'&&data.phaseGroup.sets.nodes[dataListMap.get(setList[i].id)!].slots[1].prereqType=='bye')
        {
            
            setList.splice(i,1)
            i--
        }

        
    }



     //hashmap for setList
     let setListMap = new Map<string|number,number>();
     //put key value pairs in hashmap
     for(let i=0;i<setList.length;i++)
     {
         let key:string|number=setList[i].id
         let value:number=i
         setListMap.set(key,value)
     }
     for(let i=0;i<setList.length;i++)
     {
        if(setListMap.get(setList[i].nextWinnersMatchId!)==undefined)
        {
            setList[i].nextWinnersMatchId=null
        }
     }
 
     

    for(let i=0;i<setList.length;i++)
    {
    
        if(data.phaseGroup.sets.nodes[dataListMap.get(setList[i].id)!].round>0)
        {
            matchList.winners.push(setList[i])
        }
        else
        {
            matchList.losers.push(setList[i])
        }
                
        
    }
    
    //fix this later
    matchList.losers.splice(0,2)
    return matchList
}