import getPhaseAndPhaseGroupIDs from "./getPhaseAndPhaseGroupIDs";
import { Player } from "../../../definitions/seedingTypes";
import getSeedData from "./getSeedData";
import setSeedIDs from "./setSeedIDs";
import getSetData from "./getSetData";
import getSeedMap from "./getSeedMap";
import getSingleSeedNum from "./getSingleSeedNum";
import ErrorCode from "../../ApiKeyStep/modules/enums";
function notEnoughPlayersError(seedData: any, numPlayers: number): boolean {
    for(let i = 0; i<seedData.length; i++) {
        if(seedData[i].seedNum > numPlayers) return true;
    }
    return false;
}
export default async function makeProjectedPaths(apiKey:string, slug: string, players: Player[], setR1PhaseID: (phaseID: number) => void):Promise<number[][]> {
    let [phaseIDs, phaseGroupIDs]:[number[],number[]] = await getPhaseAndPhaseGroupIDs(apiKey,slug);
    setR1PhaseID(phaseIDs[0])
    let seedData = await getSeedData(apiKey, phaseIDs)
    if(notEnoughPlayersError(seedData,players.length)) throw new Error(ErrorCode.NotEnoughPlayersInProgression+"")
    setSeedIDs(seedData,players)
    let seedMap = getSeedMap(seedData)
    let projectedPaths:number[][] = [];
    for(let i = 0; i<players.length;i++) projectedPaths.push([])
    let setDataList = await getSetData(apiKey,phaseGroupIDs)
    let setDataMap = listToMap(setDataList)
    let projectedSeeds: {[key:string]: [number,number]} = {} // Number.MAX_SAFE_INTEGER seed = bye
    for(let i = 0; i<setDataList.length; i++) {
        let [seed1, seed2]:[number,number] = await getProjectedSeeds(setDataMap,projectedSeeds,seedMap,setDataList[i].id,apiKey);
        if(seed1 == Number.MAX_SAFE_INTEGER || seed2 == Number.MAX_SAFE_INTEGER || seed1 == seed2) continue;
        projectedPaths[seed1].push(seed2)
        projectedPaths[seed2].push(seed1)
    }
    return projectedPaths
}
function listToMap(setDataList:any[]):{[key:string]: any} {
    let toReturn:{[key:string]: any} = {}
    for(let i = 0; i<setDataList.length; i++) {
        toReturn[setDataList[i].id] = setDataList[i];
    }
    return toReturn
}
async function getProjectedSeeds(setDataMap:{[key:string]: any},projectedSeeds: {[key:string]: [number,number]}, seedMap:{[key: number]:number}, setID:string, apiKey:string): Promise<[number,number]> {
    if(!projectedSeeds.hasOwnProperty(setID)){
        let toPut:number[] = []
        let currSet = setDataMap[setID]
        for(let i = 0; i<currSet.slots.length; i++) {
            if(currSet.slots[i].prereqType == 'seed') {
                let seedID = currSet.slots[i].prereqId
                if(!seedMap.hasOwnProperty(seedID)) {
                    seedMap[seedID] = await getSingleSeedNum(apiKey,seedID)-1
                }
                toPut.push(seedMap[seedID])
            } else if(currSet.slots[i].prereqType == 'set') {
                let prevSet = setDataMap[currSet.slots[i].prereqId]
                if(currSet.round >= 0 || prevSet.round < 0) { 
                    // get the projected winner of the last set
                    toPut.push(Math.min(...(await getProjectedSeeds(setDataMap,projectedSeeds,seedMap,currSet.slots[i].prereqId,apiKey))))
                } else {
                    // get the projected loser of the last set
                    toPut.push(Math.max(...(await getProjectedSeeds(setDataMap,projectedSeeds,seedMap,currSet.slots[i].prereqId,apiKey))))
                }
            } else {
                toPut.push(Number.MAX_SAFE_INTEGER)
            }
            
        }
        projectedSeeds[setID] = [toPut[0],toPut[1]]
    }
    return projectedSeeds[setID]
}