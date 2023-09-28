// deletecarpool.ts
import { log } from "../../../../../globalComponents/modules/logs";
import { Carpool, Player } from "../../../../definitions/seedingTypes";

export default function deleteCarpool(carpoolName: string | number | undefined, carpoolList: Carpool[], playerMap: Map<number, Player>, setCarpoolList: (carpools: Carpool[]) => void) {
    log('Deleted carpool ' + carpoolName);

    // Convert the playerMap values to an array and iterate over it
    const playerArray = Array.from(playerMap.values());

    for (const player of playerArray) {
        if (player.carpool?.carpoolName === carpoolName) {
            player.carpool = undefined;
        }
    }

    // Remove the carpool from the list
    const updatedCarpoolList = carpoolList.filter((carpool) => carpool.carpoolName !== carpoolName);
    setCarpoolList(updatedCarpoolList);
}
