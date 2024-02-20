import { Player } from "../../../definitions/seedingTypes";
import getSetData from "./getSetData";
import getSeedMap from "./getSeedMap";
import getSingleSeedNum from "./getSingleSeedNum";
import { log } from "../../../../globalComponents/modules/logs";
export default async function makeProjectedPaths(apiKey: string, players: Player[], seedData: any, phaseGroupIDs: number[]): Promise<number[][]> {
    let seedMap = getSeedMap(seedData)
    log('seedMap: ' + JSON.stringify(seedMap))
    let projectedPaths: number[][] = [];
    for (let i = 0; i < players.length; i++) projectedPaths.push([])
    let setDataList = await getSetData(apiKey, phaseGroupIDs)
    log('setDataList: ' + JSON.stringify(setDataList))
    let setDataMap = listToMap(setDataList)
    let projectedSeeds: { [key: number]: [number, number] } = {} // Number.MAX_SAFE_INTEGER seed = bye
    for (let i = 0; i < setDataList.length; i++) {
        let [seed1, seed2]: [number, number] = await getProjectedSeeds(setDataMap, projectedSeeds, seedMap, setDataList[i].id, apiKey);
        if (seed1 == Number.MAX_SAFE_INTEGER || seed2 == Number.MAX_SAFE_INTEGER || seed1 == seed2) continue;
        log(seed1 + ' plays ' + seed2 + ' in set ' + setDataList[i].id)
        projectedPaths[seed1].push(seed2)
        projectedPaths[seed2].push(seed1)
    }
    log('projected paths: ' + JSON.stringify(projectedPaths))
    return projectedPaths
}
function listToMap(setDataList: any[]): { [key: number]: any } {
    let toReturn: { [key: number]: any } = {}
    for (let i = 0; i < setDataList.length; i++) {
        toReturn[setDataList[i].id] = setDataList[i];
    }
    return toReturn
}
async function getProjectedSeeds(setDataMap: { [key: number]: any }, projectedSeeds: { [key: number]: [number, number] }, seedMap: { [key: number]: number }, setID: number, apiKey: string): Promise<[number, number]> {
    if (!projectedSeeds.hasOwnProperty(setID)) {
        let toPut: number[] = []
        let currSet = setDataMap[setID]
        for (let i = 0; i < currSet.slots.length; i++) {
            if (currSet.slots[i].prereqType == 'seed') {
                let seedID = currSet.slots[i].prereqId
                if (!seedMap.hasOwnProperty(seedID)) {
                    seedMap[seedID] = await getSingleSeedNum(apiKey, seedID) - 1
                    // Add a delay of 15 milliseconds
                    console.log("delay of 15ms")
                    await delay(15);

                }
                toPut.push(seedMap[seedID])
            } else if (currSet.slots[i].prereqType == 'set') {
                let prevSet = setDataMap[currSet.slots[i].prereqId]
                if (currSet.round >= 0 || prevSet.round < 0) {
                    // get the projected winner of the last set
                    toPut.push(Math.min(...(await getProjectedSeeds(setDataMap, projectedSeeds, seedMap, currSet.slots[i].prereqId, apiKey))))
                } else {
                    // get the projected loser of the last set
                    toPut.push(Math.max(...(await getProjectedSeeds(setDataMap, projectedSeeds, seedMap, currSet.slots[i].prereqId, apiKey))))
                }
            } else {
                toPut.push(Number.MAX_SAFE_INTEGER)
            }

        }
        projectedSeeds[setID] = [toPut[0], toPut[1]]
    }
    return projectedSeeds[setID]
}
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}