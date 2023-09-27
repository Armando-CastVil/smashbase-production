import { Player } from "../../../definitions/seedingTypes";
import { getCompetitorsByPage } from "../../EventDisplayStep/modules/getEntrantsFromSlug";

export default async function playerListHasChanged(playerList:Player[],eventSlug:string,apiKey:string):Promise<boolean> {
    let pages: number = 1;
    let idSet:Set<number> = new Set()
    for (let i = 1; i <= pages; i++) {
        let data = await getCompetitorsByPage(eventSlug, apiKey, i)
        pages = data.event.entrants.pageInfo.totalPages

        // set of ids of players at the tournament
        for (let j = 0; j < data.event.entrants.nodes.length; j++) {
            let playerID = data.event.entrants.nodes[j].participants[0].player.id
            idSet.add(playerID)
        }
    }
    if(idSet.size != playerList.length) return true;
    for(let i = 0; i<playerList.length; i++) {
        if(!idSet.has(playerList[i].playerID)) return true;
    }
    return false;
}