
import startGGQueryer from "../../../../pages/api/queryStartGG";
//function for api call
export default async function getTournaments(apiKey: string) {
    const query=`query TournamentsByOwner {
        currentUser {
          tournaments(query: {
            filter: {
              tournamentView: "admin"
              upcoming:true
            }
            perPage: 499
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
    const data = await startGGQueryer.queryStartGG(apiKey, query, {});
    return data
   
}