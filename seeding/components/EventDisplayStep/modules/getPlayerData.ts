import { playerData } from "../../../definitions/seedingTypes";
import queryFirebase from "../../../modules/queryFirebase";
const defaultRating = 0.36
export async function getPlayerData(id: string): Promise<playerData> {
    let playerData = await queryFirebase("/players/"+id) as playerData | null;
    if(playerData == null) playerData = {
        sets: {},
        locations: [],
        rating: 0.36
    }
    if(playerData.locations == undefined) playerData.locations = []
    if(playerData.rating == undefined) playerData.rating = defaultRating
    return playerData as playerData
}
