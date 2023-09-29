import { log } from "../../../../../globalComponents/modules/logs";
import { Carpool, Player } from "../../../../definitions/seedingTypes";

//function that removes a player from a carpool and sets that player's carpool attribute to undefined
export default function removeFromCarpool(  playerID: number,
    carpoolToChange: Carpool,
    playerMap: Map<number, Player>,
    carpoolList: Carpool[],
    setCarpoolList: (carpools: Carpool[]) => void) {
    const nextCarpoolList = carpoolList.map((carpool) => {
        if (carpool.carpoolName == carpoolToChange.carpoolName) {
            for (let i = 0; i < carpool.carpoolMembers.length; i++) {
                if (carpool.carpoolMembers[i] == playerID) {
                    playerMap.get(playerID)!.carpool = undefined;
                    carpool.carpoolMembers.splice(i, 1);
                    log('Removed '+playerID+" from carpool "+carpool.carpoolName)
                }
            }
        }
        return carpool;
    });
    setCarpoolList(nextCarpoolList);
}