import Checkbox from "@atlaskit/checkbox";
import Tournament from "../../../classes/Tournament";
import TourneyEvent from "../../../classes/TourneyEvent";

const CreateCheckboxes = (tournaments:Tournament[]|TourneyEvent[], checkedBoxIndex:number) => {
  //array of checkboxes to be returned by function
  let checkboxArray: any = [];

  //this is where the initial checkboxes are made
  for (let i = 0; i < tournaments.length; i++) {
    let checkboxName = `checkbox${i}`;
    checkboxArray.push(
      <Checkbox
        value="default checkbox"
        name={checkboxName}
        size="large"
        isChecked={i == checkedBoxIndex}
      />
    );
  }

  
  return checkboxArray;
};

export default CreateCheckboxes;