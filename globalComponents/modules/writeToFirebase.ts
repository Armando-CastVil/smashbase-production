import { ref,set } from "firebase/database";
import { db } from "./firebase";
export default async function writeToFirebase(address:string, toWrite: any)
{
    set(ref(db, address), toWrite);
}
    
    
