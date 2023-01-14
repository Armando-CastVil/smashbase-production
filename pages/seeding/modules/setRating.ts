// Import the functions you need from the SDKs you need
import Competitor from "../classes/Competitor";
import getRating from "./getRating";

export default async function setRating(playerList:Competitor[]):Promise<Competitor[]>
{
        
        
        
        for(let i=0;i<playerList.length;i++)
        {
            
           
            
            playerList[i].setRating(await getRating(playerList[i].smashggID))
           
            
        }
       
        return playerList   
} 