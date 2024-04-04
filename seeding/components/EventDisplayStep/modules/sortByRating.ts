import { Player } from "../../../definitions/seedingTypes";

export default function sortByRating(entryList: Player[]): Player[] {
  // Create a copy of the original array
  const sortedList = [...entryList].sort((entry1, entry2) => entry2.rating - entry1.rating);

  // Alternatively, you can use the slice() method to create a copy
  // const sortedList = entryList.slice().sort((entry1, entry2) => entry2.rating - entry1.rating);

  console.log("sorted list");
  console.log(sortedList);
  return sortedList;
}