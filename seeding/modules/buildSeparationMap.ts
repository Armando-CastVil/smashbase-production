import queryFirebase from "./queryFirebase";
import { Carpool, Player } from "../definitions/seedingTypes";
import { toPoint,toGlobalCoordinates } from "./coordsAndPoints";
import { getDistance } from "./getDistance";

// if 2 players location separation is less than this, don't bother
const minimumLocationSeparation = 0.01;

export default async function buildSeparationMap(
    preAvoidanceSeeding:Player[],
    carpools: Carpool[], 
    historySeparationFactor: number = 1,
    locationSeparationFactor: number = 30,
    carpoolFactorParam: number = 1000,
    customSeparations: [string, string, number][] = [] // array of 3-tuples each in the format: [id1, id2, factor to separate these 2 by]
    ): Promise<{[key: string]: {[key: string]: number}}> {

    let ids:string[] = []
    let separationFactorMap:{[key: string]: {[key: string]: number}} = {}
    for(let i = 0; i<preAvoidanceSeeding.length; i++) {
        let id = preAvoidanceSeeding[i].playerID.toString()
        ids.push(id);
        separationFactorMap[id] = {}
    }
    let playerData = await getPlayerData(ids);
    let spread = getSpread(playerData)
    if(isNaN(spread)) spread = 90
    let distUnit = Math.max(Math.min(spread/3,300),20)
    addSetHistorySeparation(separationFactorMap,ids,playerData,historySeparationFactor)
    addCarpoolSeparation(separationFactorMap,carpools,carpoolFactorParam)
    addLocationSeparation(separationFactorMap,ids,playerData,locationSeparationFactor,distUnit)
    setCustomSeparation(separationFactorMap,customSeparations)
    removeMirrorSeparation(separationFactorMap,ids)
    return separationFactorMap
}

function getSpread(playerData:playerData[]): number {
    //first get avg
    let sumX = 0
    let sumY = 0
    let sumZ = 0
    let count = 0
    for(let i = 0; i<playerData.length; i++) {
        let highestWeight = 0
        let bestLocation:location;
        for(let j = 0; j<playerData[i].locations.length; j++) {
            if(playerData[i].locations[j].weight > highestWeight) {
                highestWeight = playerData[i].locations[j].weight
                bestLocation = playerData[i].locations[j]
            }
        }
        if(highestWeight < 0.2) continue
        let point = toPoint({
            "latitude": bestLocation!.lat,
            "longitude": bestLocation!.lng,
            "altitude": 0
        })
        count++
        sumX += point.x
        sumY += point.y
        sumZ += point.z
    }
    let avgCoords = toGlobalCoordinates({
        'x':sumX/count,
        'y':sumY/count,
        'z':sumZ/count
    })
    let avgLocation:location = {
        'lat':avgCoords.latitude,
        'lng':avgCoords.longitude,
        'weight': 1
    }
    //now get sd
    let sumOfSquares = 0;
    for(let i = 0; i<playerData.length; i++) {
        let highestWeight = 0
        let bestLocation:location;
        for(let j = 0; j<playerData[i].locations.length; j++) {
            if(playerData[i].locations[j].weight > highestWeight) {
                highestWeight = playerData[i].locations[j].weight
                bestLocation = playerData[i].locations[j]
            }
        }
        if(highestWeight < 0.2) continue
        sumOfSquares += (getDistance(bestLocation!,avgLocation))**2
    }
    return (sumOfSquares/count)**0.5
}

export type location = {
    lat: number,
    lng: number,
    weight: number
}

type playerData = {
    sets: {[key: string]:{
        sets: number
    }},
    locations: location[]
}

function removeMirrorSeparation(separationFactorMap:{[key: string]: {[key: string]: number}}, ids:string[]) {
    for(let i = 0; i<ids.length; i++) {
        delete separationFactorMap[ids[i]][ids[i]];
    }
}

function getLocationSeparation(loc1: location, loc2: location,distUnit:number) {
    let distanceApart = getDistance(loc1,loc2)/distUnit
    return 0.5**(distanceApart**2) * loc1.weight * loc2.weight
}

async function getPlayerData(ids: string[]): Promise<playerData[]> {
    let toReturn: playerData[] = []
    for(let i = 0; i<ids.length; i++) {
        let playerData = await queryFirebase("/players/"+ids[i]) as playerData | null;
        if(playerData == null) playerData = {
            sets: {},
            locations: []
        }
        if(playerData.locations == undefined) playerData.locations = []
        toReturn.push(playerData as playerData)
    }
    return toReturn
}

function addLocationSeparation(separationFactorMap:{[key: string]: {[key: string]: number}}, ids:string[], playerData:playerData[], locationSeparationFactor: number,distUnit:number):void {
    for(let i = 0; i<ids.length; i++) {
        let locs1 = playerData[i].locations
        if(locs1.length == 0) continue
        for(let j = 0; j<ids.length; j++) {
            let locs2 = playerData[j].locations
            if(locs2.length == 0) continue
            let closestSeparation = 0
            for(let i1 = 0; i1<locs1.length; i1++) {
                for(let i2 = 0; i2<locs2.length; i2++) {
                    closestSeparation = Math.max(closestSeparation,getLocationSeparation(locs1[i1],locs2[i2],distUnit))
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
        let carpool:Carpool = carpools[i]
        for(let j = 0; j<carpool.carpoolMembers.length; j++) {
            let id1:string = carpool.carpoolMembers[j].toString();
            for(let k = 0; k<carpool.carpoolMembers.length; k++) {
                let id2:string = carpool.carpoolMembers[k].toString();
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
