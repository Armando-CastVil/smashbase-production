import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { firebaseConfig } from "../utility/firebaseConfig";

const app = initializeApp(firebaseConfig);
let db: any;

export default async function queryFirebase(query: string) {
  if (!db) {
    db = getDatabase();
  }

  try {
    const toReturn = (await get(ref(db, query))).val();
    return toReturn;
  } catch (error) {
    console.error(error);
    let errorString:string="not whitelisted"
    return errorString ;
  }
}
