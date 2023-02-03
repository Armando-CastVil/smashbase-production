
import { Match } from "../types/seedingTypes"
import processRound from "./processRound"


//this functions sets the winners for matches that have 2 participants
export default function processBracket(setList:Match[])
{
    let isBracketDone:boolean=false
    let rounds=0
     while(rounds<setList.length/2)
     {
         
         //setList=processRound(setList)
         rounds++
       
     }

      
 
     return setList
    
}