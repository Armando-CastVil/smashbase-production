import queryFirebase from "../../../../globalComponents/modules/queryFirebase";
import { playerData } from "../../../definitions/seedingTypes";
export function getDefaultRating(melee:boolean) {
    if(melee) {
        return 6.3;
    } else {
        return 6.3;
    }
}
function getAddress(melee: boolean, online:boolean): string {
    if(melee) {
        if(online) {
            return "/onlineMeleePlayers/"
        } else {
            return "/meleePlayers/"
        }
    } else {
        if(online) {
            return "/onlinePlayers/"
        } else {
            return "/players/"
        }
    }
}
export async function getPlayerData(id: string, melee: boolean, online:boolean): Promise<playerData> {
    let playerData = await queryFirebase(getAddress(melee,online)+id) as playerData | null;
    if(playerData == null) playerData = {
        sets: {},
        locations: [],
        rating: getDefaultRating(melee)
    }
    if(playerData.locations == undefined) playerData.locations = []
    if(playerData.rating == undefined) playerData.rating = getDefaultRating(melee)
    return playerData as playerData
}
