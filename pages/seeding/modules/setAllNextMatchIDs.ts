
import { Match } from "../types/seedingTypes";

export default function setAllNextMatchIDs(data:any,setList:Match[])
{
    
    //hashmap for setList
    let setListMap = new Map<string|number,number>();
    //put key value pairs in hashmap
    for(let i=0;i<setList.length;i++)
    {
        let key:string|number=setList[i].id
        let value:number=i
        setListMap.set(key,value)
    }

    let dataListMap = new Map<string|number,number>();
    //put key value pairs in hashmap
    for(let i=0;i<data.phaseGroup.sets.nodes.length;i++)
    {
        
        let key:string|number=data.phaseGroup.sets.nodes[i].id
        let value:number=i
        dataListMap.set(key,value)
    }
    

    //go through all the set nodes
    for(let i=0;i<data.phaseGroup.sets.nodes.length;i++)
    {
        //if the next match is in winners
        if(data.phaseGroup.sets.nodes[i].round>0)
        {
            for(let j=0;j<data.phaseGroup.sets.nodes[i].slots.length;j++)
            {
               

                if(data.phaseGroup.sets.nodes[i].slots[j].prereqId !=null && data.phaseGroup.sets.nodes[i].slots[j].prereqType=="set")
                {
                    //index for the preceding match
                    let setListIndex=dataListMap.get(data.phaseGroup.sets.nodes[i].slots[j].prereqId)
                    //because the next match is in winners, the previous match has to be in winners too
                    setList[setListIndex!].nextWinnersMatchId=data.phaseGroup.sets.nodes[i].id
                }
                
            }
        }
        //if the next match is in losers
        if(data.phaseGroup.sets.nodes[i].round<0)
        {
            for(let j=0;j<data.phaseGroup.sets.nodes[i].slots.length;j++)
            {
                if(data.phaseGroup.sets.nodes[i].slots[j].prereqId !=null && data.phaseGroup.sets.nodes[i].slots[j].prereqType=="set")
                {
                      //index for the preceding match
                      let setListIndex=dataListMap.get(data.phaseGroup.sets.nodes[i].slots[j].prereqId)
                      //if the preceding match was win winners and this one is in losers, then set this match as the
                      //preceding match's next loser's match
                      if(data.phaseGroup.sets.nodes[setListIndex!].round>0)
                      {
                        setList[setListIndex!].nextLosersMatchId=data.phaseGroup.sets.nodes[i].id
                      }
                      //else it means it's going from losers to losers
                      else
                      {
                        setList[setListIndex!].nextWinnersMatchId=data.phaseGroup.sets.nodes[i].id
                        setList[setListIndex!].nextLosersMatchId=undefined
                      }
                }
            }
        }
    }

    
   
    return setList
}