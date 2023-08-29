import { Carpool } from "../../../../definitions/seedingTypes";

//handles the creation of a new carpool, not to be confused with handling submission of this step
export default function handleMakeCarpool(event: { preventDefault: () => void }, carpoolName: string|undefined, carpoolList: Carpool[], setCarpoolList: (carpools: Carpool[]) => void) {
    event.preventDefault();
    if (carpoolName?.length === 0) {
        alert("Please enter a name for the carpool.");
        return;
    }

    let tempCarpoolList = carpoolList.slice();
    let tempCarpool: Carpool = {
        carpoolName: "test carpool",
        carpoolMembers: [],
    };

    for (let i = 0; i < tempCarpoolList.length; i++) {
        if (tempCarpoolList[i].carpoolName === carpoolName) {
            alert("There is already a carpool with that name.");
            return;
        }
    }

    tempCarpool.carpoolName = carpoolName;
    tempCarpoolList.push(tempCarpool);

    setCarpoolList(tempCarpoolList);
}
