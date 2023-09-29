import queryFirebase from "../../../../globalComponents/modules/queryFirebase";
import { playerData } from "../../../definitions/seedingTypes";
export const DEFAULT_RATING=0.36
export async function getPlayerData(id: string): Promise<playerData> {
    let playerData = await queryFirebase("/players/"+id) as playerData | null;
    if(playerData == null) playerData = {
        sets: {},
        locations: [],
        rating: DEFAULT_RATING
    }
    if(playerData.locations == undefined) playerData.locations = []
    if(playerData.rating == undefined) playerData.rating = DEFAULT_RATING
    return playerData as playerData
}
