// Import the functions you need from the SDKs you need
import Competitor from "../classes/Competitor";
import getRating from "./getRating";

export default async function setRating(playerList:Competitor[]):Promise<Competitor[]>
{
        console.log("player list inside set rating")
        console.log(playerList)
        for(let i=0;i<playerList.length;i++)
        {
            console.log("entering loop")
            console.log(playerList[i].tag)
            
            playerList[i].setRating(await getRating(playerList[i].smashggID))
            console.log("rating:"+playerList[i].rating)
            
        }
       
        return playerList   
} 