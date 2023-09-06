
import startGGQueryer from "../../../../pages/api/queryStartGG";
import { Player } from "../../../definitions/seedingTypes";
import getLocations from "./getLocations";
import getRating from "./getRating";

export default async function getEntrantsFromSlug(slug: string, apiKey: string) {

  var playerList: Player[] = [];
  var pages: number = 1;

  //for every page get the entrant info and store it in an array, return once all entries have been processed
  for (let i = 1; i <= pages; i++) {
    let data = await getCompetitorsByPage(slug, apiKey, i)
    pages = data.event.entrants.pageInfo.totalPages
    for (let j = 0; j < data.event.entrants.nodes.length; j++) {

      let playerID = data.event.entrants.nodes[j].participants[0].player.id

      let temporaryCompetitor: Player=
      {
        playerID: playerID,
        tag: data.event.entrants.nodes[j].participants[0].gamerTag,
        rating: await getRating(playerID),
        carpool: undefined,
        seedID: undefined,
        location: await getLocations(playerID),
        setHistories: {},
        seed: undefined
      }
      playerList.push(temporaryCompetitor)
    }

  }


  return playerList;




}

//some events have too many competitors, so you can't get them all from a single call
//the excess players get put on another page, which gets passed as a variable
async function getCompetitorsByPage(slug: string, apiKey: string, page: number) {
  const query = `query EventEntrants($eventSlug: String,$perPage:Int!,$page:Int!) 
    {
      event(slug:$eventSlug) 
      {
        entrants(query: 
          {
            page:$page
            perPage: $perPage
          }) 
          {
            pageInfo 
            {
              total
              totalPages
            }
            nodes 
            {
              participants 
              {
                gamerTag
                player
                {
                  id
                }
              }
            }
          }
      }
    }`
  const variables = {
    "eventSlug": slug,
    "perPage": 420,
    "page": page
  }
  const data = await startGGQueryer.queryStartGG(apiKey, query, variables);
  return data
}
