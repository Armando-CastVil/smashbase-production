import { Player } from "../../../definitions/seedingTypes";

export default function sortByRating(entryList: Player[]): Player[] {
    console.log("og list length"+ entryList.length)
  // Create a copy of the original array
  const sortedList = [...entryList].sort((entry1, entry2) => entry2.rating - entry1.rating);
  console.log("sorted list length"+ sortedList.length)
  // Alternatively, you can use the slice() method to create a copy
  // const sortedList = entryList.slice().sort((entry1, entry2) => entry2.rating - entry1.rating);


  return sortedList;

}