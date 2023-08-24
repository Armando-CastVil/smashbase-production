
import startGGQueryer from "../../../../pages/api/queryStartGG";
//function for api call
export default async function getTournaments(apiKey: string) {
    const query=`query TournamentsByOwner($perPage: Int!) {
        currentUser {
          tournaments(query: {
            filter: {
              tournamentView: "admin"
              upcoming:true
            }
            perPage: $perPage
          }) {
            nodes {
            name
            city
            url
            slug
            startAt
            images{
              url
            }
            }
          }
        }
    }`
    const variables= { 
        "perPage":69,     
      }
    const data = await startGGQueryer.queryStartGG(apiKey, query, variables);
    return data
   
}