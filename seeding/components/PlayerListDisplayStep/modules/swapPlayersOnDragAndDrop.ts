import { arrayMoveImmutable } from "array-move";
import { Player } from "../../../definitions/seedingTypes";
import { assignSeeds } from "../../EventDisplayStep/modules/assignSeeds";
//handles the swapping of players during dragging and dropping
export default function swapPlayersOnDragAndDrop(firstPlayerIndex: number,secondPlayerIndex: number | undefined,playerList:Player[]) {
 
    //if they get dropped outside the table don't make any changes
    if (secondPlayerIndex == undefined) {
      return playerList;
    }
    //otherwise move the players
    else {
      let newPlayerList = arrayMoveImmutable(playerList,firstPlayerIndex,secondPlayerIndex);
      return assignSeeds(newPlayerList);
    }
  }