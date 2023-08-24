import { Player } from "../../../definitions/seedingTypes";

export default function setSeedIDs(seedData: any, players:Player[]):void {
    let seedIDMap:{[key:number]: number} = {}
    for(let i = 0; i<seedData.length; i++) {
        let json = seedData[i];
        if(json.players == null) continue;
        seedIDMap[json.players[0].id] = json.id
    }
    for(let i = 0; i<players.length; i++) {
        players[i].seedID = seedIDMap[players[i].playerID]
    }
}