import { ref, get } from "firebase/database";
import ErrorCode from "../../seeding/components/ApiKeyStep/modules/enums";
import { db } from "./firebase";
import { log } from "./logs";

export default async function queryFirebase(query: string) {
  try {
    log('Querying Firebase: '+query)
    const toReturn = (await get(ref(db, query))).val();
    log('Firebase Response: '+JSON.stringify(toReturn))
    return toReturn;
  } catch (error) {
    if(error instanceof Error && error.message == "Permission denied") {
      throw new Error(ErrorCode.NotWhitelisted+"")
    }
    else {
      throw error;
    }
  }
}
