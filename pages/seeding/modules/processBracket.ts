
import { Match } from "../types/seedingTypes"
import processRound from "./processRounds"


//this functions sets the winners for matches that have 2 participants
export default function processBracket(setList:Match[])
{
    let isBracketDone:boolean=false
    let rounds=0
     while(rounds<setList.length/2)
     {
         console.log("round:")
         console.log(rounds)
         setList=processRound(setList)
         rounds++
       
     }

      
 
     return setList
    
}