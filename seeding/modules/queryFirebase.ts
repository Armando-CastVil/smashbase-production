import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { firebaseConfig } from "../utility/firebaseConfig";
import ErrorCode from "../components/ApiKeyStep/modules/enums";

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
    if(error instanceof Error && error.message == "Permission denied") {
      throw new Error(ErrorCode.NotWhitelisted+"")
    }
    else {
      console.error(error);
      throw error;
    }
  }
}
