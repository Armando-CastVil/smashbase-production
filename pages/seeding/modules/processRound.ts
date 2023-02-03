import { mkdirSync } from "fs";
import Competitor from "../classes/Competitor";
import { Match } from "../types/seedingTypes";


export default async function processRound(matchArray:Match[])
{
     //create array for matches
     let matchMap = new Map<string|number,number >();

    matchMap=await(updateMatchMap(matchMap,matchArray))
    
    for(let i=0;i<matchArray.length;i++)
    {
        
        await processMatch(matchArray[i],matchMap,matchArray)
    }
    
    return matchArray
}


async function processMatch(match:Match,matchMap:Map<string|number,number>,matchArray:Match[])
{
    
     //if a match has 2 competitors and neither has been declared the winner
    let competitors:Competitor[]
    if(hasTwoUnprocessed(match))
    {
        
        competitors=await makeCopies(match)
        await setWinner(match)
        await pushCompetitors(match,matchMap,competitors,matchArray)
    }
    else
    {
    return
    }
}
function hasTwoUnprocessed(match:Match)
{
    //if theres an expected bye on the next match, and a double bye on the current match, then dont push
   
    if(match.competitors.length!=2)
    {
        return false
    }
    if(match.competitors[0].seed==69420&&match.competitors[1].seed==69420)
    {
        
        return false
    }
    if(match.competitors.length==2&&match.competitors[0].isWinner==false&&match.competitors[1].isWinner==false)
    {
        
        return true
    }
    else
    {
        return false
    }

}
async function setWinner(match:Match)
{
    if(match.competitors[0].seed<=match.competitors[1].seed)
    {
        match.competitors[0].isWinner=true
    }
    else
    {
        match.competitors[1].isWinner=true
    }
}
async function makeCopies(match:Match)
{
    
    let competitors:Competitor[]=[]
    var tempCompetitor1:Competitor=JSON.parse(JSON.stringify(match.competitors[0]))
    var tempCompetitor2:Competitor=JSON.parse(JSON.stringify(match.competitors[1]))
    competitors.push(tempCompetitor1)
    competitors.push(tempCompetitor2)
    return competitors
}
async function pushCompetitors(match:Match,matchMap:Map<string|number,number>,competitors:Competitor[],matchArray:Match[])
{
    
    
    //first scenario; if match is in winners, push winner to next winners match and loser to next losers match
    if(match.bracketSide=="winners" &&match.nextWinnersMatchId!=null&&match.nextWinnersMatchId!=undefined&&match.nextWinnersMatchId!=""
    &&matchArray[matchMap.get(match.nextWinnersMatchId!)!]!=undefined&&matchArray[matchMap.get(match.nextWinnersMatchId!)!].competitors.length!=2)
    {

       
        if(match.competitors[0].isWinner==true)
        {
            matchArray[matchMap.get(match.nextWinnersMatchId!)!].competitors.push(competitors[0])
        }

        if(match.competitors[1].isWinner==true)
        {
            matchArray[matchMap.get(match.nextWinnersMatchId!)!].competitors.push(competitors[1])
        }

        if(match.nextLosersMatchId!=null&&match.nextLosersMatchId!=undefined&&match.nextLosersMatchId!=""
        &&matchArray[matchMap.get(match.nextLosersMatchId!)!]!=undefined&&matchArray[matchMap.get(match.nextLosersMatchId!)!].competitors.length!=2)
        {
            if(match.competitors[0].isWinner==true)
            {
                matchArray[matchMap.get(match.nextLosersMatchId!)!].competitors.push(competitors[1])
            }

            if(match.competitors[1].isWinner==true)
            {
                matchArray[matchMap.get(match.nextLosersMatchId!)!].competitors.push(competitors[0])
            }
            
        }
        
    }
    //first scenario ends here

    //second scenario; if match is in losers, push winner to next winners match and loser to next losers match
    //this is only the case for losers finals, winner gets sent back to winners bracket, so check for that 
    if(match.bracketSide=="losers"&&match.nextWinnersMatchId!=null&&match.nextWinnersMatchId!=undefined&&match.nextWinnersMatchId!=""
    &&matchArray[matchMap.get(match.nextWinnersMatchId!)!]!=undefined&&matchArray[matchMap.get(match.nextWinnersMatchId!)!].competitors.length!=2)
    {
        if(match.competitors[0].isWinner==true)
        {
            matchArray[matchMap.get(match.nextWinnersMatchId!)!].competitors.push(competitors[0])
        }
        if(match.competitors[1].isWinner==true)
        {
            matchArray[matchMap.get(match.nextWinnersMatchId!)!].competitors.push(competitors[1])
        }
        
    }
    ///third scenario; regular losers bracket match. push winner on to next match in losers
    if(match.bracketSide=="losers" &&match.nextLosersMatchId!=null&&match.nextLosersMatchId!=undefined&&match.nextLosersMatchId!=""
    &&matchArray[matchMap.get(match.nextLosersMatchId!)!]!=undefined&&matchArray[matchMap.get(match.nextLosersMatchId!)!].competitors.length!=2)
    {
        
        if(match.competitors[0].isWinner==true)
        {
            matchArray[matchMap.get(match.nextLosersMatchId!)!].competitors.push(competitors[0])
        }
        if(match.competitors[1].isWinner==true)
        {
            matchArray[matchMap.get(match.nextLosersMatchId!)!].competitors.push(competitors[1])
        }
        
    }

    //edge case where there's no next winners but there is a next losers, only happens at the end of a phase
    if(match.bracketSide=="winners" &&match.nextWinnersMatchId==null&&match.nextLosersMatchId!=undefined&&match.nextLosersMatchId!=""
    &&matchArray[matchMap.get(match.nextLosersMatchId!)!]!=undefined&&matchArray[matchMap.get(match.nextLosersMatchId!)!].competitors.length!=2)
    {
        
        if(match.competitors[0].isWinner==true)
        {
            matchArray[matchMap.get(match.nextLosersMatchId!)!].competitors.push(competitors[1])
        }
        if(match.competitors[1].isWinner==true)
        {
            matchArray[matchMap.get(match.nextLosersMatchId!)!].competitors.push(competitors[0])
        }
        
    }

return matchArray
}

async function updateMatchMap(matchMap:Map<string|number,number >,matchArray:Match[])
{
    //put key value pairs in hashmap
    for(let i=0;i<matchArray.length;i++)
    {
       
        //make this id the key for the hash map
        let key:string|number=matchArray[i].id

        //make the match we just pushed to the match array as the value
        let value:number=i

        //push this in to the hash map
        matchMap.set(key,value)
    }

    return matchMap
}