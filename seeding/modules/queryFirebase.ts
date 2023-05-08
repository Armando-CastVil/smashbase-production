import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { firebaseConfig } from "../utility/firebaseConfig";

const app = initializeApp(firebaseConfig);
let db: any;

export default async function queryFirebase(query: string, refreshRate?: number) {
  if (!refreshRate && refreshRate != 0) refreshRate = 24 * 3600 * 1000; //1 day in ms

  if (typeof window !== "undefined") {
    const cacheString = localStorage.getItem(query);
    if (cacheString != null) {
      const cache = JSON.parse(cacheString);
      if (
        cache.lastUpdate + refreshRate > Date.now() &&
        cache.data != undefined
      ) {
        return cache.data;
      }
    }
  }

  if (!db) {
    db = getDatabase();
  }

  try {
    const toReturn = (await get(ref(db, query))).val();
    if (typeof window !== "undefined") {
      const toCache: any = {
        data: toReturn,
        lastUpdate: Date.now(),
      };
      localStorage.setItem(query, JSON.stringify(toCache));
    }
    return toReturn;
  } catch (error) {
    console.error(error);
    let errorString:string="not whitelisted"
    return errorString ;
  }
}
