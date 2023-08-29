import { Carpool, Player } from "../../../../definitions/seedingTypes";

export default function addToCarpool(
  playerID: number,
  carpool: Carpool,
  playerMap: Map<number, Player>,
  carpoolList: Carpool[],
  setCarpoolList: (carpools: Carpool[]) => void
) {
  let player = playerMap.get(playerID);

  if (player!.carpool != undefined) {
    for (let i = 0; i < carpoolList.length; i++) {
      if (carpoolList[i].carpoolName == player!.carpool.carpoolName) {
        for (let j = 0; j < carpoolList[i].carpoolMembers.length; j++) {
          if (carpoolList[i].carpoolMembers[j] == player!.playerID) {
            carpoolList[i].carpoolMembers.splice(j, 1);
          }
        }
      }
    }
  }

  if (player != undefined) {
    carpool.carpoolMembers.push(player.playerID);
    player.carpool = carpool;
  }

  setCarpoolList(carpoolList.slice());
}
