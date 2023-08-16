import Checkbox from "@atlaskit/checkbox";
import { useState } from "react";
import Tournament from "../../../classes/Tournament";

const CreateCheckboxes = (tournaments:Tournament[], checkedBoxIndex:number) => {
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