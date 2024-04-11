import { Carpool, Player, location } from "../../../definitions/seedingTypes";
import { toPoint,toGlobalCoordinates } from "./coordsAndPoints";
import { getDistance } from "./getDistance";

// if 2 players location separation is less than this, don't bother
const minimumLocationSeparation = 0.01;

export default function buildSeparationMap(
    preAvoidanceSeeding:Player[],
    carpools: Carpool[], 
    historySeparationFactor: number = 1,
    locationSeparationFactor: number = 30,
    carpoolFactorParam: number = 1000,
    customSeparations: [string, string, number][] = [] // array of 3-tuples each in the format: [id1, id2, factor to separate these 2 by]
    ): {[key: string]: {[key: string]: number}} {

    let separationFactorMap:{[key: string]: {[key: string]: number}} = {}
    for(let i = 0; i<preAvoidanceSeeding.length; i++) {
        separationFactorMap[preAvoidanceSeeding[i].playerID.toString()] = {}
    }
    let spread = getSpread(preAvoidanceSeeding)
    if(isNaN(spread)) spread = 90
    let distUnit = Math.max(Math.min(spread/3,300),20)
    addSetHistorySeparation(separationFactorMap,preAvoidanceSeeding,historySeparationFactor)
    addCarpoolSeparation(separationFactorMap,carpools,carpoolFactorParam)
    addLocationSeparation(separationFactorMap,preAvoidanceSeeding,locationSeparationFactor,distUnit)
    setCustomSeparation(separationFactorMap,customSeparations)
    removeMirrorSeparation(separationFactorMap,preAvoidanceSeeding)
    console.log("Separation map: "+ separationFactorMap)
    return separationFactorMap
}

function getSpread(preAvoidanceSeeding: Player[]): number {
    //first get avg
    let sumX = 0
    let sumY = 0
    let sumZ = 0
    let count = 0
    for(let i = 0; i<preAvoidanceSeeding.length; i++) {
        let highestWeight = 0
        let bestLocation:location;
        for(let j = 0; j<preAvoidanceSeeding[i].locations.length; j++) {
            if(preAvoidanceSeeding[i].locations[j].weight > highestWeight) {
                highestWeight = preAvoidanceSeeding[i].locations[j].weight
                bestLocation = preAvoidanceSeeding[i].locations[j]
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
    for(let i = 0; i<preAvoidanceSeeding.length; i++) {
        let highestWeight = 0
        let bestLocation:location;
        for(let j = 0; j<preAvoidanceSeeding[i].locations.length; j++) {
            if(preAvoidanceSeeding[i].locations[j].weight > highestWeight) {
                highestWeight = preAvoidanceSeeding[i].locations[j].weight
                bestLocation = preAvoidanceSeeding[i].locations[j]
            }
        }
        if(highestWeight < 0.2) continue
        sumOfSquares += (getDistance(bestLocation!,avgLocation))**2
    }
    return (sumOfSquares/count)**0.5
}

function removeMirrorSeparation(separationFactorMap:{[key: string]: {[key: string]: number}}, preAvoidanceSeeding: Player[]) {
    for(let i = 0; i<preAvoidanceSeeding.length; i++) {
        let id = preAvoidanceSeeding[i].playerID.toString()
        delete separationFactorMap[id][id];
    }
}

function getLocationSeparation(loc1: location, loc2: location,distUnit:number) {
    let distanceApart = getDistance(loc1,loc2)/distUnit
    return 0.5**(distanceApart**2) * loc1.weight * loc2.weight
}

function addLocationSeparation(separationFactorMap:{[key: string]: {[key: string]: number}}, preAvoidanceSeeding:Player[], locationSeparationFactor: number,distUnit:number):void {
    for(let i = 0; i<preAvoidanceSeeding.length; i++) {
        let locs1 = preAvoidanceSeeding[i].locations
        if(locs1.length == 0) continue
        for(let j = 0; j<preAvoidanceSeeding.length; j++) {
            let locs2 = preAvoidanceSeeding[j].locations
            if(locs2.length == 0) continue
            let closestSeparation = 0
            for(let i1 = 0; i1<locs1.length; i1++) {
                for(let i2 = 0; i2<locs2.length; i2++) {
                    closestSeparation = Math.max(closestSeparation,getLocationSeparation(locs1[i1],locs2[i2],distUnit))
                }
            }
            if(closestSeparation<minimumLocationSeparation) continue
            let id1 = preAvoidanceSeeding[i].playerID.toString()
            let id2 = preAvoidanceSeeding[j].playerID.toString()
            if(!separationFactorMap[id1].hasOwnProperty(id2)) {
                separationFactorMap[id1][id2] = 0
            }
            separationFactorMap[id1][id2] += closestSeparation * locationSeparationFactor
        }
    }

}

function addSetHistorySeparation(separationFactorMap:{[key: string]: {[key: string]: number}}, preAvoidanceSeeding: Player[], historySeparationFactor: number):void {
    for(let i = 0; i<preAvoidanceSeeding.length; i++) {
        let currPlayer = preAvoidanceSeeding[i];
        let id = currPlayer.playerID.toString()
        for(const oppID in currPlayer.setHistories) {
            if(!currPlayer.setHistories.hasOwnProperty(oppID)) continue;
            if(!separationFactorMap[id].hasOwnProperty(oppID)) separationFactorMap[id][oppID] = 0
            separationFactorMap[id][oppID] += currPlayer.setHistories[oppID] * historySeparationFactor;
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
