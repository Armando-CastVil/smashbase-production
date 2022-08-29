import Competitor from "../classes/Competitor";
import { Match } from "../types/seedingTypes";

export default function processRound(setList:Match[])
{
    console.log("setlist before processRound")
    console.log(setList)
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
        if(setList[i].competitors.length==2&&setList[i].competitors[0].isWinner==false&&setList[i].competitors[1].isWinner==false)
        {
            let nextWinnersMatchIndex=setListMap.get(setList[i].nextWinnersMatchId!)
            let nextLosersMatchIndex=setListMap.get(setList[i].nextLosersMatchId!)
            if(setList[i].competitors[0].seed<setList[i].competitors[1].seed)
            {
                
                if(nextLosersMatchIndex!=undefined)
                {
                    console.log(setList[nextLosersMatchIndex!].id)
                }
                
                //make a copy of the competitors and push them on to the next match
                var tempWinner:Competitor=JSON.parse(JSON.stringify(setList[i].competitors[0]))
                
                setList[nextWinnersMatchIndex!].competitors.push(tempWinner)
                var tempLoser:Competitor=JSON.parse(JSON.stringify(setList[i].competitors[1]))
                if(nextLosersMatchIndex!=undefined)
                {
                    setList[nextLosersMatchIndex!].competitors.push(tempLoser)
                }
                
                setList[i].competitors[0].isWinner=true

            }
            else
            {
                if(nextWinnersMatchIndex!=undefined)
                {
                    //make a copy of the competitors and push them on to the next match
                    var tempWinner:Competitor=JSON.parse(JSON.stringify(setList[i].competitors[1]))
                    setList[nextWinnersMatchIndex!].competitors.push(tempWinner)
                    

                }
             
                
                if(nextLosersMatchIndex!=undefined)
                {
                    var tempLoser:Competitor=JSON.parse(JSON.stringify(setList[i].competitors[0]))
                    setList[nextLosersMatchIndex!].competitors.push(tempLoser)
                }
                setList[i].competitors[1].isWinner=true
            }
        }
    }
    return setList
}