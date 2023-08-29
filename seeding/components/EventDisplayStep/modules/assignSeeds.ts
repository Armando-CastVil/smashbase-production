import { Player } from "../../../definitions/seedingTypes";

export function assignSeeds(playerList: Player[]) {
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].seed = i + 1;
    }
  
    return playerList;
  }