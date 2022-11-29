import { initializeApp } from "firebase/app";
import { getDatabase,ref,get } from "firebase/database";
import { firebaseConfig } from "../../utility/firebaseConfig"; 
import { app } from "../../SeedingApp";
// Initialize Firebase
var db:any;
export default async function getRating(ID:String)
{
    if(!db) db = getDatabase();
    let rating = (await get(ref(db,"players/"+ID+"/rating"))).val();
    if(rating==null)
    {
        
        rating = 0;
    }
    
    return rating
}
    
    
