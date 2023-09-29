import { Player } from "../../../definitions/seedingTypes";

const REMATCH_CONFLICT_THRESHOLD = 1

export default function numRematchConflicts(playerList:Player[], projectedPaths: number[][]): number {
    let counter = 0;
    for(let seed1 = 0; seed1<projectedPaths.length; seed1++) {
        let p1 = playerList[seed1];
        for(let j = 0; j<projectedPaths[seed1].length; j++) {
            let seed2 = projectedPaths[seed1][j];
            let p2 = playerList[seed2];
            if(p1.setHistories.hasOwnProperty(p2.playerID.toString()) && p1.setHistories[p2.playerID.toString()] >= REMATCH_CONFLICT_THRESHOLD) {
                console.log(p1.playerID+' vs '+p2.playerID)
                counter++;
            }
        }
    }
    return counter/2;
}