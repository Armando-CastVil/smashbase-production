import startGGQueryer from "../../../../pages/api/queryStartGG";

const seedQuery = `query seeds($phase: ID!, $page: Int) {
      phase(id: $phase) {
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
            }
            id
            seedNum
          }
          pageInfo {
            totalPages
          }
        }
      }
    }`

//function for api call
export default async function getSeedData(apiKey: string, phaseIDs: number[]): Promise<any> {
  let data: any[] = []
  let totalPages = 1
  for(let i = 0; i<phaseIDs.length; i++) {
    let phaseID = phaseIDs[i];
    for (let page = 1; page <= totalPages; page++) {
      const variables = {
        "page": page,
        "phase": phaseID
      }
      data.push(...(await startGGQueryer.queryStartGG(apiKey, seedQuery, variables)).phase.seeds.nodes)
      totalPages = data[data.length - 1].phaseGroup.seeds.pageInfo.totalPages
    }
  }
  return data
}