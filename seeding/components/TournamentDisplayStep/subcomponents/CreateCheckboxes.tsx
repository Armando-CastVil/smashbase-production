import Checkbox from "@atlaskit/checkbox";
import { Tournament, TourneyEvent } from "../../../definitions/seedingTypes";


const CreateCheckboxes = (tournaments:Tournament[]|TourneyEvent[], checkedBoxIndex:number) => {
  //if there's only one option, auto check that
  if(tournaments.length == 1) checkedBoxIndex = 0;

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