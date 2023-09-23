import { log } from "../../../../../globalComponents/modules/logs";
import { Carpool } from "../../../../definitions/seedingTypes";

export default function deleteCarpool(carpoolName: string | number | undefined,carpoolList:Carpool[], setCarpoolList: (carpools: Carpool[]) => void) {
    log('Deleted carpool '+carpoolName)
    setCarpoolList(carpoolList.filter((carpool) => carpool.carpoolName !== carpoolName));
  }