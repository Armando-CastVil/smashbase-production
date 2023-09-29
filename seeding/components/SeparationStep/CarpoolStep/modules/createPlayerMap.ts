import { Player } from "../../../../definitions/seedingTypes";

export default function createPlayerMap(playerList: Player[]) {
    //hashmap so we can retrieve players by their smashgg ids
    let playerMap = new Map<number, Player>();

    //put key value pairs in hashmap
    for (let i = 0; i < playerList.length; i++) {
        let key: number = playerList[i].playerID;
        let value: Player = playerList[i];
        playerMap.set(key, value);
    }

    return playerMap;
}