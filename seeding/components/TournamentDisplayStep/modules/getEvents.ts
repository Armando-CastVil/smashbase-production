import startGGQueryer from "../../../../pages/api/queryStartGG";
//function for api call
export default async function getEvents(apiKey: string,slug:string) {
    const query= `query TournamentQuery($slug: String) {
        tournament(slug: $slug){
            id
            name
            events(filter: {
                videogameId: [1386,1],
                type: 1
            }) {
                id
                name
                slug
                numEntrants
                videogame {
                    id
                }
                isOnline
            }
        }
    }`
    const variables= { 
        "slug":slug  
      }
    const data = await startGGQueryer.queryStartGG(apiKey, query, variables);
    return data
   
}