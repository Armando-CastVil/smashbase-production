import { Carpool, Player } from "../../../../definitions/seedingTypes";
import * as imports from "../modules/CarpoolStepIndex"
import stepStyles from "../../../../../styles/CarpoolStep.module.css"
interface props {
    carpoolName:string|undefined;
    setCarpoolName: (carpoolName: string) => void;
    carpoolList: Carpool[];
    setCarpoolList: (carpools: Carpool[]) => void;
}
export default function MakeCarpoolForm({carpoolName,setCarpoolName,carpoolList,setCarpoolList}:props)
{
    return(
        <form onSubmit={(e) => imports.handleMakeCarpool(e, carpoolName, carpoolList, setCarpoolList)}>
        <label className={stepStyles.labelMessage}>
          <input
            type="text"
            className={stepStyles.labelMessage}
            placeholder="Carpool Name"
            value={carpoolName}
            onChange={(e) => setCarpoolName(e.target.value)}
          />
        </label>
        <input className={stepStyles.createCarpoolButton} type="submit" value="Create Carpool" style={{ color: "white" }}
        />
      </form>
    )
}