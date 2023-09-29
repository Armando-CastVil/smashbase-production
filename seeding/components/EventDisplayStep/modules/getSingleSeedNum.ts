import startGGQueryer from "../../../../pages/api/queryStartGG";

const singleSeedQuery = `query getSingleSeed($id: ID!) {
  seed(id: $id) {
    seedNum
  }
}`

export default async function getSingleSeedNum(apiKey: string, seedID: number):Promise<number> {
    let data = await startGGQueryer.queryStartGG(apiKey, singleSeedQuery, {'id':seedID})
    return data.seed.seedNum
}