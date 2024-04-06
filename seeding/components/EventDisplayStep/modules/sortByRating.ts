import { Player } from "../../../definitions/seedingTypes";
export default function sortByRating(entryList:Player[]):Player[]
{
console.log("this is the og sorting function")
const sortedList=entryList.sort((entry1,entry2)=>(entry1.rating<entry2.rating)? 1 :(entry1.rating>entry2.rating) ?-1:0);
console.log("og list length:"+ entryList)
console.log("after list length:"+ sortedList)
return sortedList
}