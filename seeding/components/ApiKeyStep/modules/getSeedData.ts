import startGGQueryer from "../../../../pages/api/queryStartGG";
//function for api call
export default async function getSeedData(apiKey: string, phaseGroup: string) {
  let data:any[] = []
  let totalPages = 1
  for(let page = 1; page <= totalPages; page++) {
    const query=`query seeds($phaseGroup: ID!, $page: Int) {
      phaseGroup(id: $phaseGroup) {
        phase {
          id
        }
        seeds(query: {
          perPage: 500
          page: $page
        }) {
          nodes {
            players {
              id
              gamerTag
            }
            id
            seedNum
          }
        }
      }
    }`
    const variables= { 
        "page":page,     
      }
    data.push(await startGGQueryer.queryStartGG(apiKey, query, variables))
    totalPages = data[data.length-1].phaseGroup.seeds.pageInfo.totalPages
  }
  return data
}