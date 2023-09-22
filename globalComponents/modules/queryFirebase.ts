import { ref, get } from "firebase/database";
import ErrorCode from "../../seeding/components/ApiKeyStep/modules/enums";
import { db } from "./firebase";

export default async function queryFirebase(query: string) {
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
