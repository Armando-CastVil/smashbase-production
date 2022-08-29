import { initializeApp } from "firebase/app";
import { getDatabase,ref,get } from "firebase/database";
import { firebaseConfig } from "../../utility/firebaseConfig"; 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
export default async function getRating(ID:String)
{

    const rating = (await get(ref(db,"players/"+ID+"/rating"))).val();
    if(rating==null)
    {
        
        return 0
    }
    else
    {
        
        return rating
    }
    
}
    
    
