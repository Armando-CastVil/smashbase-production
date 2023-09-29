import { Player } from "../../../definitions/seedingTypes";
import { getDistance } from "./getDistance";

const CONFLICT_DISTANCE_THRESHOLD = 50;//miles

export default function numRegionConflicts(playerList:Player[], projectedPaths: number[][]): number {
    let counter = 0;
    for(let seed1 = 0; seed1<projectedPaths.length; seed1++) {
        for(let j = 0; j<projectedPaths[seed1].length; j++) {
            let seed2 = projectedPaths[seed1][j];
            let p1 = playerList[seed1];
            let p2 = playerList[seed2];
            let closestDistance: number|null = null;
            for(let locI1 = 0; locI1<p1.locations.length; locI1++) {
                for(let locI2 = 0; locI2<p2.locations.length; locI2++) {
                    let distance = getDistance(p1.locations[locI1],p2.locations[locI2]);
                    if(closestDistance == null || distance < closestDistance) closestDistance = distance;
                }
            }
            if(closestDistance != null && closestDistance<CONFLICT_DISTANCE_THRESHOLD) {
                counter++;
            }
        }
    }
    return counter/2;
}