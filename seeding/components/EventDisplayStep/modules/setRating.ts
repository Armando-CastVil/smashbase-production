// Import the functions you need from the SDKs you need
import { Player } from "../../../definitions/seedingTypes";
import getRating from "../../../modules/getRating";

export default async function setRating(playerList:Player[]):Promise<Player[]>
{

        for(let i=0;i<playerList.length;i++)
        {
            playerList[i].rating=await getRating(playerList[i].playerID)
        }
       
        return playerList   
} 