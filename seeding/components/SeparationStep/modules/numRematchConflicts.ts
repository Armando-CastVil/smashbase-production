import { Player } from "../../../definitions/seedingTypes";

const REMATCH_CONFLICT_THRESHOLD = 1

export default function numRematchConflicts(playerList:Player[], projectedPaths: number[][]): number {
    let counter = 0;
    for(let seed1 = 0; seed1<projectedPaths.length; seed1++) {
        for(let j = 0; j<projectedPaths[seed1].length; j++) {
            let seed2 = projectedPaths[seed1][j];
            if(seed1 > seed2) continue; //prevents double counting
            let p1 = playerList[seed1];
            let p2 = playerList[seed1];
            if(p1.setHistories.hasOwnProperty(p2.playerID) && p1.setHistories[p2.playerID] >= REMATCH_CONFLICT_THRESHOLD) counter++;
        }
    }
    return counter;
}