
import startGGQueryer from "../../../../pages/api/queryStartGG";
import { Player, playerData } from "../../../definitions/seedingTypes";
import { getPlayerData } from "./getPlayerData";

export default async function getEntrantsFromSlug(slug: string, apiKey: string) {

  var playerList: Player[] = [];
  var pages: number = 1;

  var rawData:any[] = [];
  for (let i = 1; i <= pages; i++) {
    let newData = await getCompetitorsByPage(slug, apiKey, i)
    pages = newData.event.entrants.pageInfo.totalPages
    rawData.push(newData)
  }
  let idSet:Set<string> = new Set()
  for (let i = 0; i < rawData.length; i++) {
    for (let j = 0; j < rawData[i].event.entrants.nodes.length; j++) {
      let playerID = rawData[i].event.entrants.nodes[j].participants[0].player.id
      idSet.add(playerID.toString())
    }
  }
  //for every page get the entrant info and store it in an array, return once all entries have been processed
  for (let i = 0; i < rawData.length; i++) {
    for (let j = 0; j < rawData[i].event.entrants.nodes.length; j++) {

      let playerID = rawData[i].event.entrants.nodes[j].participants[0].player.id

      let playerData: playerData = await getPlayerData(playerID)

      // only add set histories with other players at the tournament
      let filteredSetHistories:{ [key: string]: number } = {};
      for(const oppID in playerData.sets) {
        if(playerData.sets.hasOwnProperty(oppID) && idSet.has(oppID)) {
          filteredSetHistories[oppID] = playerData.sets[oppID].sets
        }
      }

      let player: Player=
      {
        playerID: playerID,
        tag: rawData[i].event.entrants.nodes[j].participants[0].gamerTag,
        rating: playerData.rating,
        carpool: undefined,
        seedID: undefined,
        locations: playerData.locations,
        setHistories: filteredSetHistories
      }
      playerList.push(player)
    }

  }


  return playerList;




}

//some events have too many competitors, so you can't get them all from a single call
//the excess players get put on another page, which gets passed as a variable
export async function getCompetitorsByPage(slug: string, apiKey: string, page: number) {
  const query = `query EventEntrants($eventSlug: String,$page:Int!) 
    {
      event(slug:$eventSlug) 
      {
        entrants(query: 
          {
            page:$page
            perPage: 499
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
    "page": page
  }
  const data = await startGGQueryer.queryStartGG(apiKey, query, variables);
  return data
}
