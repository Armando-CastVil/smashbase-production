import Popup from "reactjs-popup";
import { Carpool } from "../types/seedingTypes";
import { useState } from "react";

interface props {
  carpoolList:Carpool[];
  setCarpoolList:(carpoolList:Carpool[]) => void;
  
}

export default function CarpoolForm({carpoolList,setCarpoolList}:props){

  const [carpoolName,setCarpoolName]=useState<string|undefined>("")

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    let tempCarpool:Carpool=
    {
      carpoolName:"",
      carpoolMembers:[]
    }

    tempCarpool.carpoolName=carpoolName
    carpoolList.push(tempCarpool)
    console.log(carpoolList)
    setCarpoolList(carpoolList)
  }

  
    return(
    <div>
      <h4>Carpool Form PopUp</h4>
      <Popup trigger={<button> Click to Create Carpool  </button>} 
       position="right center">
        <form onSubmit={handleSubmit}>
      <label>Enter Carpool Name:
        <input 
          type="text" 
          value={carpoolName}
          onChange={(e) => setCarpoolName(e.target.value)}
        />
      </label>
      <input type="submit" />
    </form>
        
      </Popup>
    </div>
    )
  };