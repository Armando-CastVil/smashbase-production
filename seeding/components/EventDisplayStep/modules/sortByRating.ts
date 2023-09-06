import { Player } from "../../../definitions/seedingTypes";
export default function sortByRating(entryList:Player[]):Player[]
{
const sortedList=entryList.sort((entry1,entry2)=>(entry1.rating<entry2.rating)? 1 :(entry1.rating>entry2.rating) ?-1:0);
return sortedList
}