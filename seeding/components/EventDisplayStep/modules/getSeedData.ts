import startGGQueryer from "../../../../pages/api/queryStartGG";

const seedQuery = `query seeds($phase: ID!, $page: Int) {
      phase(id: $phase) {
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
  console.log("phaseIDs")
  console.log(phaseIDs)
  let data: any[] = []
  let totalPages = 1
  for(let i = 0; i<phaseIDs.length; i++) {
    let phaseID = phaseIDs[i];
    for (let page = 1; page <= totalPages; page++) {
      const variables = {
        "page": page,
        "phase": phaseID
      }
      let temp_data=await startGGQueryer.queryStartGG(apiKey, seedQuery, variables)
      data.push(...(temp_data.phase.seeds.nodes))
      totalPages = temp_data.phase.seeds.pageInfo.totalPages
    }
  }
  return data
}