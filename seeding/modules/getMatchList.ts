import { Match } from "../definitions/seedingTypes";
import Competitor from "../classes/Competitor";
import fillInitialRounds from "./fillInitialRounds";
import processBracket from "./processBracket";
//import processBracket from "./processBracket";
import finalizeMatchStructure from "./finalizeMatchStructure";



//interface for the object we will be returning
interface MatchStructure
{
    winners:Match[],
    losers:Match[]
}

//note: competitor is a class that is used for processing purposes, participant is used for displaying purposes.

//this function returns the list of all matches in the tournament and all the data that comes with it
export default async function getMatchList(data:any,playerList:Competitor[])
{
    
    //initializing arrays
    //setList is an array of matches with no distinction between winners bracket and losers bracket
    var setList:Match[]=[];
    //matchList is the setList but with distinction between winners and losers bracket, this is the object that this function returns
    var matchList:MatchStructure=
    {
        winners:[],
        losers:[]
    }
    //fills in the info for round 1 only, since they are the only unprocessed matches
    let initialSetList=fillInitialRounds(data,playerList)
    setList=JSON.parse(JSON.stringify(initialSetList))
    setList=JSON.parse(JSON.stringify(processBracket(setList)))


    //after all the sets are processed, separate winners and losers sets
    //matchList=finalizeMatchStructure(setList,data,matchList)
    matchList=finalizeMatchStructure(setList,data,matchList)
    
    /*
    //set the next match of grands to null to prevent an error
   // matchList.winners[matchList.winners.length-1].nextMatchId=null
*/
    return matchList


  
}