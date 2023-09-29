
export const selectedBoxIndex = (checkBoxes: any[]) => {
    var index: number = -1;
    //go through all the boxes and check if one has been selected
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].props.isChecked) {
        index = i;
      }
    }
    return index;
  };