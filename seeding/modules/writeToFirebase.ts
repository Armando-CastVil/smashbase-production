import { initializeApp } from "firebase/app";
import { getDatabase,ref,set } from "firebase/database";
import { firebaseConfig } from "../utility/firebaseConfig";
//import { app } from "../../seeding";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
var db:any;
export default async function writeToFirebase(address:string, toWrite: any)
{
    if(!db) 
    {
        db = getDatabase();
    }
    set(ref(db, address), toWrite);
}
    
    
