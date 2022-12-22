import { initializeApp } from "firebase/app";
import { getDatabase,ref,get } from "firebase/database";
import { firebaseConfig } from "../../utility/firebaseConfig";
//import { app } from "../../seeding";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
var db:any;
export default async function queryFirebase(query:string, refreshRate?: number)
{
    if(!refreshRate) refreshRate = 24*3600*1000;//1 day in ms
    if (typeof window !== 'undefined') {
        let cacheString = localStorage.getItem(query);
        if(cacheString != null) {
            let cache = JSON.parse(cacheString);
            if(cache.lastUpdate + refreshRate > Date.now() && cache.data != undefined) {
                console.log("queried '"+query+"' but it was cached as ",cache.data);
                return cache.data;
            }
        }
    }
    console.log("query '"+query+"' was not cached, querying firebase");
    if(!db) 
    {
        db = getDatabase();
    }
    let toReturn = (await get(ref(db,query))).val();
    if (typeof window !== 'undefined') {
        let toCache:any = {
            data: toReturn,
            lastUpdate: Date.now()
        };
        localStorage.setItem(query,JSON.stringify(toCache));
    }
    
    return toReturn;
}
    
    
