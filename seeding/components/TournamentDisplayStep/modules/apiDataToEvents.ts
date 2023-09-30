import { TourneyEvent } from "../../../definitions/seedingTypes";


//takes the data obtained from the API call and turns it in to an array
export function apiDataToEvents(apiData: any) {
  
    let eventArray: TourneyEvent[] = [];
    for (let i = 0; i < apiData.tournament.events.length; i++) {
      let name: string = apiData.tournament.events[i].name;
      let id: number = apiData.tournament.events[i].id;
      let slug: string = apiData.tournament.events[i].slug;
      let numEntrants: number = apiData.tournament.events[i].numEntrants;
      let isOnline: boolean = apiData.tournament.events[i].isOnline
      let vgid: number = apiData.tournament.events[i].videogame.id
      let tempEvent:TourneyEvent  ={
        name:name, 
        id:id, 
        slug:slug, 
        numEntrants:numEntrants,
        online: isOnline,
        videogameId: vgid
      };
      eventArray.push(tempEvent);
    }
  
    return eventArray;
  }