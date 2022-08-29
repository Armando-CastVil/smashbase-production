import { SetStateAction, useEffect, useState } from "react";
import { Carpool } from "../types/seedingTypes";


interface CarpoolDropDownMenuProps {
    cList: Carpool[],
    updateSelectedCarpool: (arg: Carpool) => void
  }
export default function CarpoolDropDownMenu({cList,updateSelectedCarpool}:CarpoolDropDownMenuProps)
{
    const [selectedCarpool, setSelectedCarpool] = useState<Carpool>()
    const [value, setValue] = useState<string>("select carpool");
    const [carpool,setCarpool]=useState<Carpool>()
    useEffect(() => {
    setSelectedCarpool(carpool)
    },[carpool])
    
    
    
    const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setValue(event.target.value);
        const tempCarpool = cList.find((obj) => {
            return obj.carpoolName === event.target.value;
          });
        console.log("tempcarpool:")
        console.log(tempCarpool)
        updateSelectedCarpool(tempCarpool!)
      };

    return(
        <select onChange={handleChange}> 
                 <option value={value}> -- Select a carpool -- </option>
            
                {cList.map((carpool) => <option value={carpool.carpoolName}>{carpool.carpoolName}</option>)}
                </select>
    )
}