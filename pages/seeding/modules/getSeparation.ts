import { initializeApp } from "firebase/app";
import { getDatabase,ref,get } from "firebase/database";
import Competitor from "../classes/Competitor";
import { firebaseConfig } from "../../utility/firebaseConfig";
import { Carpool } from "../types/seedingTypes";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
var conservativity = 1000;
var carpoolFactor = 200;
var oldSeeding:seedPlayer[];
var newSeeding:seedPlayer[];

type seed = {
    projectedPath:seed[];
	seedNum:number;//0-indexed
}

type seedPlayer = {
    competitor:Competitor;
    oldSeed:number;//0-indexed
    setHistories: {[opponent: string]: number};
    seed:seed;
    conflictFactor:number;//sum of projected set histories, relative to original seeding
    seedDistance:number;//geometric distance from actual rating to seeded rating multiplied by conservativity
}

export default async function getSeparation(competitors:Competitor[], carpools: Carpool[], maximumFunctionRuntime?: number, conservativityParam?: number, carpoolFactorParam?: number) {

    console.log("player list before separation:")
    console.log(competitors)
    //setup
    if(typeof maximumFunctionRuntime === "undefined") {
        maximumFunctionRuntime = 3000;
    }
    if(typeof conservativityParam !== "undefined") {
        conservativity = conservativityParam;
    } 
    if(typeof carpoolFactorParam !== "undefined") {
        carpoolFactor = carpoolFactorParam;
    }
    conservativity = conservativity as number;
    maximumFunctionRuntime = maximumFunctionRuntime as number;
    const start:number = Date.now();
    const end:number = start+maximumFunctionRuntime;

    //first initialize seed objs
    let seeds:seed[] = []
    for(let i = 0; i<competitors.length; i++) {
        let nextSeed:seed = {
            projectedPath: [],
            seedNum: i
        }
        seeds.push(nextSeed);
    }

    //add projected paths to seeds
    for(let i = 0; i<competitors.length; i++) {
        for(let j = 0; j<competitors[i].projectedPath.length; j++) {
            let opponentSeedNum = competitors[i].projectedPath[j].seed-1;
            //-1 because it has to be 0 indexed
            seeds[i].projectedPath.push(seeds[opponentSeedNum]);
        }
    }

    //recreate the initial seeding
    oldSeeding = [];
    newSeeding = [];
    for(let i = 0; i<competitors.length; i++) {
        let newPlayer:seedPlayer = {
            competitor: competitors[i],
            oldSeed: i,
            seed: seeds[i],
            setHistories: {},
            conflictFactor: 0,//will set later
            seedDistance: conservativity,
        }
        oldSeeding.push(newPlayer);
        newSeeding.push(newPlayer);
    }

    //make a list of players sorted by their score aka how much they contribute to the heuristic
    //score is their conflictFactor + seedDistance
    let scoreList:seedPlayer[] = [];
    for(let i = 0; i<oldSeeding.length; i++) {
        oldSeeding[i].conflictFactor = await getConflictFactor(oldSeeding[i]);
        scoreList.push(oldSeeding[i]);
    }
    let scoreSort = (a:seedPlayer, b:seedPlayer) => 
        b.conflictFactor - a.conflictFactor
        + b.seedDistance - a.seedDistance;
    scoreList.sort(scoreSort);
    // console.log(scoreList);
    // console.log(oldSeeding);
    // console.log(newSeeding);

    //main loop
    let scoreListIdx = 0;
    //player 1 is the high score player we want to find someone to swap with
    //player 2 is the person we are considering swapping with player 1
    let numLoops = 0;
    for(let player1:seedPlayer = scoreList[scoreListIdx];
        Date.now()<end //go until we run out of time
        && scoreListIdx < scoreList.length //make sure we didn't run out of players
        && player1.conflictFactor + player1.seedDistance > 1; //or its seeded perfectly
        player1 = scoreList[scoreListIdx]) {
        numLoops++;

        //seeds 1-4 will never swap
        if(player1.oldSeed<4) {
            scoreListIdx++;
            continue;
        }

        //setup player 2 search boundaries
        let lastPowerOf2 = 2 ** Math.floor(Math.log2(player1.seed.seedNum));
        let ceiling:number;//exclusive
        let floor:number;//inclusive
        if(player1.oldSeed >= lastPowerOf2*1.5) {
            ceiling = 2*lastPowerOf2;
            floor = 1.5*lastPowerOf2;
        } else {
            ceiling = 1.5*lastPowerOf2;
            floor = lastPowerOf2;
        }

        let swapMade:boolean = false;
        let upperIdx:number = player1.oldSeed + 1;
        let lowerIdx:number = player1.oldSeed - 1;
        let currIdx :number = player1.oldSeed;

        while(player1.seedDistance + 2*player1.conflictFactor > getGeoDist(currIdx,player1.oldSeed)) {
            let player2:seedPlayer = newSeeding[currIdx];
            if(player1 != player2) {
                //find out what the score would be if we swapped
                let scoreChange = - player1.conflictFactor
                                  - player2.conflictFactor
                                  - player1.seedDistance
                                  - player2.seedDistance;
                await swap(player1,player2);
                scoreChange += player1.conflictFactor
                            +  player2.conflictFactor
                            +  player1.seedDistance
                            +  player2.seedDistance;

                //if it was a bad swap, swap back
                if(scoreChange > 0) await swap(player1,player2);
                else {
                    swapMade = true;
                    break;
                }
            }
            //find next idx
            if(upperIdx >= ceiling && lowerIdx < floor) break;
            else if(upperIdx >= ceiling) {
                currIdx = lowerIdx;
                lowerIdx--;
            } else if(lowerIdx < floor) {
                currIdx = upperIdx;
                upperIdx++;
            } else {
                let upperDist = getGeoDist(player1.oldSeed,upperIdx);
                let lowerDist = getGeoDist(player1.oldSeed,lowerIdx);
                if(lowerDist>upperDist) {
                    currIdx = upperIdx;
                    upperIdx++;
                } else {
                    currIdx = lowerIdx;
                    lowerIdx--;
                }
            }
        }
        if(swapMade) {
            scoreListIdx = 0;
            scoreList.sort(scoreSort);
        } else scoreListIdx++;
    }
    console.log("separation took "+numLoops+" loops and "+(Date.now()-start)+" ms");
    let toReturn = [];
    for(let i = 0; i<newSeeding.length; i++) {
        toReturn.push(newSeeding[i].competitor);
    }
    console.log("player list after separation:")
    console.log(toReturn)
    return toReturn;

}

async function getConflictFactor(player:seedPlayer): Promise<number> {
    let toReturn = 0;
    let projectedSeeds = player.seed.projectedPath;
    for(let i = 0; i<projectedSeeds.length; i++) {
        let opponent = newSeeding[projectedSeeds[i].seedNum];
        if(!player.setHistories.hasOwnProperty(opponent.competitor.smashggID)) {
            let history = (await get(ref(db,"players/"+player.competitor.smashggID+"/sets/"+opponent.competitor.smashggID))).val();
            console.log(player.competitor.smashggID+" "+opponent.competitor.smashggID+" "+history);
            if(history == undefined) {
                player.setHistories[opponent.competitor.smashggID] = 0;
                opponent.setHistories[player.competitor.smashggID] = 0;
            } else {
                player.setHistories[opponent.competitor.smashggID] = history;
                opponent.setHistories[player.competitor.smashggID] = history;
            }
            if(player.competitor.carpool == opponent.competitor.carpool) {
                player.setHistories[opponent.competitor.smashggID] += carpoolFactor;
                opponent.setHistories[player.competitor.smashggID] += carpoolFactor;
            }
        }
        toReturn += (player.setHistories[opponent.competitor.smashggID] ** 2)/projectedSeeds.length;
    }
  
    return toReturn;
}

function getGeoDist(seed1: number, seed2: number) {
    let dist = oldSeeding[seed1].competitor.rating/oldSeeding[seed2].competitor.rating;
    if(dist>1) return dist*conservativity;
    else return conservativity/dist;
}

async function swap(player1:seedPlayer, player2: seedPlayer) {
    //swap them in the array
    let p1Idx = player1.seed.seedNum;
    let p2Idx = player2.seed.seedNum;
    newSeeding[p1Idx] = player2;
    newSeeding[p2Idx] = player1;

    //swap their seed objects
    let temp = player1.seed;
    player1.seed = player2.seed;
    player2.seed = temp;

    //update scores
    player1.conflictFactor = await getConflictFactor(player1);
    player2.conflictFactor = await getConflictFactor(player2);
    player1.seedDistance = getGeoDist(player1.oldSeed,player1.seed.seedNum);
    player2.seedDistance = getGeoDist(player2.oldSeed,player2.seed.seedNum);
}