import Competitor from "../classes/Competitor";
import { Match } from "../types/seedingTypes";

export default function processRound(matchList:Match[],matchMap:Map<string,number >)
{
   
    
    for(let i=0;i<matchList.length;i++)
    {
        if(matchList[i].competitors.length==2&&matchList[i].competitors[0].isWinner==false&&matchList[i].competitors[1].isWinner==false)
        {
            let nextWinnersMatchIndex=matchMap.get(matchList[i].nextWinnersMatchId!)
            let nextLosersMatchIndex=matchMap.get(matchList[i].nextLosersMatchId!)
            if(matchList[i].competitors[0].seed<matchList[i].competitors[1].seed)
            {
                
                
                //make a copy of the competitors and push them on to the next match
                var tempWinner:Competitor=JSON.parse(JSON.stringify(matchList[i].competitors[0]))
                matchList[i].winner=tempWinner
                matchList[nextWinnersMatchIndex!].competitors.push(tempWinner)
                var tempLoser:Competitor=JSON.parse(JSON.stringify(matchList[i].competitors[1]))
                matchList[i].loser=tempLoser
                if(nextLosersMatchIndex!=undefined)
                {
                    matchList[nextLosersMatchIndex!].competitors.push(tempLoser)
                }
                
                matchList[i].competitors[0].isWinner=true

            }
            else
            {
                if(nextWinnersMatchIndex!=undefined)
                {
                    //make a copy of the competitors and push them on to the next match
                    var tempWinner:Competitor=JSON.parse(JSON.stringify(matchList[i].competitors[1]))
                    matchList[nextWinnersMatchIndex!].competitors.push(tempWinner)
                    

                }
             
                
                if(nextLosersMatchIndex!=undefined)
                {
                    var tempLoser:Competitor=JSON.parse(JSON.stringify(matchList[i].competitors[0]))
                    matchList[nextLosersMatchIndex!].competitors.push(tempLoser)
                }
                matchList[i].competitors[1].isWinner=true
            }
        }
    }
    return matchList
}