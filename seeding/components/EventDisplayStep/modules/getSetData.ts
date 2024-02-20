import startGGQueryer from "../../../../pages/api/queryStartGG";

const setQuery = `query sets($phaseGroup: ID!, $page: Int) {
      phaseGroup(id: $phaseGroup) {
        sets(perPage: 400, page: $page, filters: {
          showByes: true
        }) {
          pageInfo {
            totalPages
          }
          nodes {
            id
            round
            slots(includeByes: false) {
              prereqId
              prereqType
            }
          }
        }
      }
    }`

export default async function getSetData(apiKey: string, phaseGroupIDs:number[]) {
  let data: any[] = []
  let totalPages = 1
  for(let i = 0; i<phaseGroupIDs.length; i++) {
    let phaseGroupID = phaseGroupIDs[i];
    for (let page = 1; page <= totalPages; page++) {
      const variables = {
        "page": page,
        "phaseGroup": phaseGroupID
      }
      let temp_data = await startGGQueryer.queryStartGG(apiKey, setQuery, variables)
      data.push(...(temp_data.phaseGroup.sets.nodes))
      totalPages = temp_data.phaseGroup.sets.pageInfo.totalPages
    }
  }
  return data
}