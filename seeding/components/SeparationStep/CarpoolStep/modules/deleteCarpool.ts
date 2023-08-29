import { Carpool } from "../../../../definitions/seedingTypes";

export default function deleteCarpool(carpoolName: string | number | undefined,carpoolList:Carpool[], setCarpoolList: (carpools: Carpool[]) => void) {
    setCarpoolList(carpoolList.filter((carpool) => carpool.carpoolName !== carpoolName));
  }