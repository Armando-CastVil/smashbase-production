import queryFirebase from "./queryFirebase";
import Competitor from "../classes/Competitor";
import { Carpool } from "../seedingTypes";

// if 2 players location separation is less than this, don't bother
const minimumLocationSeparation = 0.01;

export default async function buildSeparationMap(
    competitors:Competitor[],
    carpools: Carpool[], 
    historySeparationFactor: number = 1,
    locationSeparationFactor: number = 30,
    carpoolFactorParam: number = 200,
    customSeparations: [string, string, number][] = [] // array of 3-tuples each in the format: [id1, id2, factor to separate these 2 by]
    ): Promise<{[key: string]: {[key: string]: number}}> {

    let ids:string[] = []
    let separationFactorMap:{[key: string]: {[key: string]: number}} = {}
    for(let i = 0; i<competitors.length; i++) {
        let id = competitors[i].smashggID
        ids.push(id);
        separationFactorMap[id] = {}
    }
    let playerData = await getPlayerData(ids);
    addSetHistorySeparation(separationFactorMap,ids,playerData,historySeparationFactor)
    addCarpoolSeparation(separationFactorMap,carpools,carpoolFactorParam)
    // addLocationSeparation(separationFactorMap,ids,playerData,locationSeparationFactor)
    setCustomSeparation(separationFactorMap,customSeparations)
    return separationFactorMap
}

type location = {
    lat: number,
    lng: number,
    weight: number
}

type playerData = {
    sets: {[key: string]:{
        sets: number,
        wins: number
    }},
    locations: location[]
}

function getLocationSeparation(loc1: location, loc2: location) {
    let distanceApart = ((loc1.lng-loc2.lng)**2 + (loc1.lat-loc2.lat)**2)**0.5
    const distUnit = 2
    return 0.5**((distanceApart/distUnit)**2)
}

async function getPlayerData(ids: string[]): Promise<playerData[]> {
    let toReturn: playerData[] = []
    for(let i = 0; i<ids.length; i++) {
        let playerData = await queryFirebase("/players/"+ids[i]) as playerData | null;
        if(playerData == null) playerData = {
            sets: {},
            locations: []
        }
        toReturn.push(playerData as playerData)
    }
    return toReturn
}

function addLocationSeparation(separationFactorMap:{[key: string]: {[key: string]: number}}, ids:string[], playerData:playerData[], locationSeparationFactor: number):void {
    for(let i = 0; i<ids.length; i++) {
        let locs1 = playerData[i].locations
        if(locs1.length == 0) continue
        for(let j = 0; j<ids.length; j++) {
            let locs2 = playerData[j].locations
            if(locs2.length == 0) continue
            let closestSeparation = 0
            for(let i1 = 0; i1<locs1.length; i1++) {
                for(let i2 = 0; i2<locs2.length; i2++) {
                    closestSeparation = Math.max(closestSeparation,getLocationSeparation(locs1[i1],locs2[i2]))
                }
            }
            if(closestSeparation<minimumLocationSeparation) continue
            if(!separationFactorMap[ids[i]].hasOwnProperty(ids[j])) {
                separationFactorMap[ids[i]][ids[j]] = 0
            }
            separationFactorMap[ids[i]][ids[j]] += closestSeparation * locationSeparationFactor
        }
    }

}

function addSetHistorySeparation(separationFactorMap:{[key: string]: {[key: string]: number}}, ids:string[], playerData:playerData[], historySeparationFactor: number):void {
    for(let i = 0; i<ids.length; i++) {
        let id = ids[i]
        let allSetHistories = playerData[i].sets;
        if(!allSetHistories) continue;
        for(let j = 0; j<ids.length; j++) {
            let oppID = ids[j]
            if(!allSetHistories.hasOwnProperty(oppID)) continue;
            if(!separationFactorMap[id].hasOwnProperty(oppID)) separationFactorMap[id][oppID] = 0
            separationFactorMap[id][oppID] += allSetHistories[oppID].sets * historySeparationFactor;
        }
    }
}

function addCarpoolSeparation(separationFactorMap:{[key: string]: {[key: string]: number}}, carpools: Carpool[],carpoolFactorParam:number):void {
    for(let i = 0; i<carpools.length; i++) {
        let carpool = carpools[i]
        for(let j = 0; j<carpool.carpoolMembers.length; j++) {
            let id1 = carpool.carpoolMembers[j];
            for(let k = 0; k<carpool.carpoolMembers.length; k++) {
                let id2 = carpool.carpoolMembers[k];
                if(!separationFactorMap[id1].hasOwnProperty(id2)) separationFactorMap[id1][id2] = 0
                separationFactorMap[id1][id2] += carpoolFactorParam;
            }
        }
    }
}

function setCustomSeparation(separationFactorMap:{[key: string]: {[key: string]: number}}, customSeparations:[string, string, number][]): void {
    for(let i = 0; i<customSeparations.length; i++) {
        let id1 = customSeparations[i][0]
        let id2 = customSeparations[i][1]
        separationFactorMap[id1][id2] = customSeparations[i][2]
        separationFactorMap[id2][id1] = customSeparations[i][2]
    }
}
