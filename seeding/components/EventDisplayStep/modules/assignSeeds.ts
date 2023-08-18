import Competitor from "../../../classes/Competitor";

export function assignSeeds(playerList: Competitor[]) {
    for (let i = 0; i < playerList.length; i++) {
      playerList[i].seed = i + 1;
    }
  
    return playerList;
  }