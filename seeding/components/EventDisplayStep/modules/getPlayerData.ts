import queryFirebase from "../../../../globalComponents/modules/queryFirebase";
import { playerData } from "../../../definitions/seedingTypes";
export function getDefaultRating(melee:boolean) {
    if(melee) {
        return 7.7;
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
    let address:string = getAddress(melee,online)+id
    if(online) {
        let rating = await queryFirebase(address)
        let toReturn:playerData = {
            sets:{},
            locations:[],
            rating: getDefaultRating(melee)
        }
        if(rating != null) toReturn.rating = rating;
        return toReturn
    } else {
        let playerData = await queryFirebase(address) as playerData | null;
        if(playerData == null) playerData = {
            sets: {},
            locations: [],
            rating: getDefaultRating(melee)
        }
        if(playerData.locations == undefined) playerData.locations = []
        if(playerData.rating == undefined) playerData.rating = getDefaultRating(melee)
        return playerData as playerData
    }
}