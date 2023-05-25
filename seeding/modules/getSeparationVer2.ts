import Competitor from "../classes/Competitor";
import assert from "assert";
import { Carpool } from "../seedingTypes";
import queryFirebase from "./queryFirebase";

// if 2 values are less than this apart they're equal, used for tests
const differenceThreshold = 0.00001;
// test mode is used for testing different parts of the function
const testMode = false;


export default function getSeparationVer2(
    competitors:Competitor[], 
    separationFactorMap:{[key: string]: {[key: string]: number}},
    numTopStaticSeeds: number = 0,
    conservativityParam: number = 30, 
    maximumFunctionRuntime: number = 3000,
    ):Competitor[] {
    if(testMode) console.log("test mode is active!")
    if(testMode) {
        competitors.sort((a: Competitor, b: Competitor) => {
            if (a.tag < b.tag) {
                return -1;
            } else if (a.tag > b.tag) {
                return 1;
            } else {
                return 0;
            }
        });
        for(let i =0; i<competitors.length; i++) competitors[i].seed = i+1;
    }

    //make sure players are in order of rating
    adjustRatings(competitors);
    for(let i = 1; i<competitors.length; i++) {
        if(competitors[i].rating-competitors[i-1].rating>differenceThreshold){
            throw new Error("THE PLAYERS ARENT IN ORDER OF RATING, the player with smash gg ID of "+competitors[i].smashggID+
            " has rating "+competitors[i].rating+" and is index "+i+" and the player with smash gg ID of "+competitors[i-1].smashggID+
            " has rating "+competitors[i-1].rating+" and is index "+(i-1))
        }
    }
    //make sure seeds are accurate
    for(let i = 0; i<competitors.length; i++) {
        if(competitors[i].seed != i+1) throw new Error("HEY AC THE SEED PROPERTY OF COMPETITOR ISNT ACCURATE, the player with smash gg ID of "+competitors[i].smashggID+
            " has seed property of "+competitors[i].seed+" but is index "+i+". The seed should be the index + 1"
        );
    }

    //prepare each argument individually
    let ids:string[] = []
    for(let i = 0; i<competitors.length; i++) {
        let id = competitors[i].smashggID
        ids.push(id);
    }

    //print separation
    let sepMapByTag: {[key: string]:{[key: string]: number}} = {}
    for(let i = 0; i<competitors.length; i++) {
        sepMapByTag[competitors[i].tag] = {}
        for(let j = 0; j<competitors.length; j++) {
            if(!separationFactorMap[ids[i]].hasOwnProperty(ids[j])) continue
            sepMapByTag[competitors[i].tag][competitors[j].tag] = separationFactorMap[ids[i]][ids[j]]
        }
    }
    console.log(sepMapByTag)

    // verify separationFactorMap is symmetrical
    if(testMode) {
        for(let i = 0;i<ids.length; i++) {
            let m = separationFactorMap[ids[i]];
            for(let oppID in m) {
                if(!m.hasOwnProperty(oppID)) continue
                assert(Math.abs(m[oppID] - separationFactorMap[oppID][ids[i]]) < differenceThreshold)
            }
        }
    }

    let ratingField:number[] = [];
    for(let i = 0; i<competitors.length; i++) ratingField.push(competitors[i].rating);

    let projectedPaths: number[][] = [];
    for(let i = 0; i<competitors.length; i++) {
        let competitor = competitors[i];
        projectedPaths.push([]);
        for(let j = 0; j<competitor.projectedPath.length; j++) {
            let opp = competitor.projectedPath[j];
            projectedPaths[i].push(opp.seed-1);
        }
    }

    let sep:separation = new separation(separationFactorMap,ids,ratingField,projectedPaths,conservativityParam!,numTopStaticSeeds);


    //RUN IT
    let startTime = new Date().getTime();
    let results = separate(sep,maximumFunctionRuntime!);
    console.log(new Date().getTime()-startTime+" ms")
    if(testMode) {
        sep.testForAdditionalSwaps();
    }

    //get into the right format
    let toReturn:Competitor[] = [];
    for(let i = 0; i<results.length; i++) {
        toReturn.push(competitors[results[i].oldSeed]);
    }
    return toReturn;
}


class separation {
    ratingField: number[]; //const
    projectedPaths: number[][]; //const
    numPlayers: number; //const
    conservativity: number; //const
    oldSeeding: seedPlayer[]; //const
    score: number;
    heap: seedPlayerHeap;
    newSeeding: seedPlayer[];
    constructor(separationFactorMap: {[key: string]: {[key: string]: number}}, ids: string[], ratingField: number[], projectedPaths: number[][], conservativity: number, numTopStaticSeeds:number) {
        //errors
        assert(ratingField.length == Object.keys(separationFactorMap).length)
        assert(ratingField.length == projectedPaths.length)

        //initialize properties
        this.ratingField = ratingField;
        this.projectedPaths = projectedPaths;
        this.score = 0; //will be updated later in the constructor
        this.heap = new seedPlayerHeap(); //will be updated later in the constructor
        this.numPlayers = ratingField.length;
        this.conservativity = conservativity;
        this.newSeeding = [] //will be updated later in the constructor
        this.oldSeeding = [] //will be updated later in the constructor

        //initialize seed players
        let currMinSeed = 0;
        let nextMinSeed = 1;
        for(let i = 0; i<this.numPlayers; i++) {

            // update seed boundaries
            if(i == nextMinSeed) {
                currMinSeed = nextMinSeed;
                if(nextMinSeed<4) nextMinSeed++;
                else if(nextMinSeed%3 == 0) nextMinSeed *= 4.0/3;
                else nextMinSeed *= 3.0/2;
            }

            //initialize seed player
            let newPlayer:seedPlayer = {
                id: ids[i],
                oldSeed: i,
                newSeed: i,
                heapIdx: -1,
                conflictScore: 0, //will be updated later in constructor
                distScore: 0,
                score: 0, //will be updated later in constructor
                minSeed: currMinSeed,
                maxSeed: Math.min(nextMinSeed,this.numPlayers)-1,
                separationFactors: separationFactorMap[ids[i]]
            }
            if(i<numTopStaticSeeds) {
                newPlayer.maxSeed = i
                newPlayer.minSeed = i
            }

            this.newSeeding.push(newPlayer); //complete init
            this.oldSeeding.push(newPlayer); //complete init
        }
        for(let i = 0; i<this.numPlayers; i++) {
            //update score and heap
            let p:seedPlayer = this.oldSeeding[i];
            this.updateConflictScore(p); // complete init
            p.score = p.conflictScore // complete init
            this.score += p.score; //complete init
            this.heap.insert(p); //complete init
        }
    }
    //updates this.score and seedPlayer.score and heap in one fell swoop to ensure the heap stays accurate
    updateScoreAndHeap(p:seedPlayer):void {
        this.score += p.conflictScore + p.distScore - p.score;
        p.score = p.conflictScore + p.distScore;
        if(p.heapIdx == -1) return;
        this.heap.update(p.heapIdx);
    }
    updateConflictScore(p:seedPlayer):void {
        p.conflictScore = 0;
        let opps = this.currentOpponents(p);
        for(let i = 0; i<opps.length; i++) {
            if(p.separationFactors[opps[i].id]) p.conflictScore += p.separationFactors[opps[i].id] ** 2;
        }
        p.conflictScore **= 0.5;
        p.conflictScore /= opps.length;
    }
    updateDistScore(p:seedPlayer) {
        p.distScore = this.conservativity * Math.abs(Math.log2(this.ratingField[p.newSeed]/this.ratingField[p.oldSeed]));
    }
    currentOpponents(p:seedPlayer): seedPlayer[]{
        let toReturn:seedPlayer[] = []
        let path = this.projectedPaths[p.newSeed];
        for(let i = 0; i<path.length; i++) {
            toReturn.push(this.newSeeding[path[i]])
        }
        return toReturn;
    }
    swapPlayers(p1:seedPlayer,p2:seedPlayer):void {
        let s1 = p1.newSeed;
        let s2 = p2.newSeed;
        //need to update: this.score, this.heap, this.newSeeding, 
        //seedPlayer.newSeed, seedPlayer.distScore, seedPlayer.conflictScore, seedPlayer.score, seedPlayer.heapIdx

        //calculate affectedPlayers
        let affectedPlayers:seedPlayer[] = this.newSeeding;//this.currentOpponents(p1).concat(this.currentOpponents(p2))
        // affectedPlayers.push(p2);
        // affectedPlayers.push(p1);

        //update this.newSeeding
        this.newSeeding[p1.newSeed] = p2;
        this.newSeeding[p2.newSeed] = p1;

        //update seedPlayer.newSeed
        let seed1 = p1.newSeed;
        let seed2 = p2.newSeed;
        this.newSeeding[seed1].newSeed = seed1;
        this.newSeeding[seed2].newSeed = seed2;

        //update seedPlayer.distScore
        this.updateDistScore(p1);
        this.updateDistScore(p2);

        //update seedPlayer.conflictScore
        for(let i = 0; i<affectedPlayers.length; i++) this.updateConflictScore(affectedPlayers[i]);

        //update this.score and this.heap
        for(let i = 0; i<affectedPlayers.length; i++) this.updateScoreAndHeap(affectedPlayers[i]);
        if(testMode) {
            assert(s1 == p2.newSeed);
            assert(s2 == p1.newSeed);
        }
    }
    // tester function
    verify():void {
        //verify array lengths
        assert(this.numPlayers == this.ratingField.length && this.numPlayers == this.projectedPaths.length && this.numPlayers == this.oldSeeding.length && this.numPlayers == this.newSeeding.length && this.heap.data.length <= this.numPlayers);

        //verify score
        let actualScore = 0;
        for(let i = 0; i<this.numPlayers; i++) {
            actualScore += this.newSeeding[i].score;
        }
        assert(Math.abs(actualScore - this.score)<differenceThreshold);

        //verify oldSeeding
        for(let i = 0; i<this.numPlayers; i++) assert(this.oldSeeding[i].oldSeed == i);

        //verify newSeeding
        for(let i = 0; i<this.numPlayers; i++) assert(this.newSeeding[i].newSeed == i);

        //verify heapIdx
        for(let i = 0; i<this.numPlayers; i++) {
            if(this.oldSeeding[i].heapIdx == -1) continue;
            assert(this.oldSeeding[i] == this.heap.data[this.oldSeeding[i].heapIdx])
        }

        //verify newSeed is within min and max seed
        for(let i = 0; i<this.numPlayers; i++) assert(this.newSeeding[i].minSeed <= i && i <= this.newSeeding[i].maxSeed);

        //verify conflict score is correct
        for(let i = 0; i<this.numPlayers; i++) {
            let p = this.oldSeeding[i];
            let oldConflictScore = p.conflictScore;
            this.updateConflictScore(p)
            assert(Math.abs(p.conflictScore - oldConflictScore)<differenceThreshold);
        }

        //verify dist score is correct
        for(let i = 0; i<this.numPlayers; i++) {
            let p = this.oldSeeding[i];
            let oldDistScore = p.distScore;
            this.updateDistScore(p)
            assert(Math.abs(p.distScore - oldDistScore)<differenceThreshold);
        }

        //verify seedPlayer.score is correct
        for(let i = 0; i<this.numPlayers; i++) {
            let p = this.oldSeeding[i];
            assert(Math.abs(p.distScore + p.conflictScore - p.score)<differenceThreshold);
        }

        //verify heap is correct
        this.heap.verify();

        //verify seedPlayer.maxSeed and seedPlayer.minSeed
        for(let i = 0; i<this.numPlayers; i++) {
            let lastPowerOf2 = 2**Math.floor(Math.log2(i));
            if(i<4) {
                assert(this.oldSeeding[i].minSeed == i);
                assert(this.oldSeeding[i].maxSeed == i);
            } else if(i < lastPowerOf2*3/2) {
                assert(this.oldSeeding[i].minSeed == lastPowerOf2);
                assert(this.oldSeeding[i].maxSeed == Math.min(this.numPlayers,lastPowerOf2*3/2)-1);
            } else {
                assert(this.oldSeeding[i].minSeed == lastPowerOf2*3/2);
                assert(this.oldSeeding[i].maxSeed == Math.min(this.numPlayers,2*lastPowerOf2)-1);
            }
        }
    }
    testForAdditionalSwaps():void {
        for(let i = 0; i<this.numPlayers; i++) {
            let p1 = this.newSeeding[i];
            for(let j = p1.minSeed; j<=p1.maxSeed; j++) {
                let p2 = this.newSeeding[j];
                let prevScore = this.score;
                this.swapPlayers(p1,p2);
                assert(this.score>=prevScore);
                this.swapPlayers(p1,p2);
            }
        }
    }
}
type seedPlayer = {
    id: string //const
    oldSeed: number; //const
    minSeed: number; //const
    maxSeed: number; //const
    separationFactors: {[key: string]: number}; //const
    newSeed: number;
    heapIdx: number;
    conflictScore: number;
    distScore: number;
    score: number;
}
//max heap
class seedPlayerHeap {
    data: seedPlayer[];
    constructor(){
        this.data = [];
    }
    deleteMin():seedPlayer | undefined {
        if(this.data.length == 0) return undefined;
        this.swap(0,this.data.length-1);
        let toReturn = this.data.pop();
        if(this.data.length > 0) this.update(0);
        toReturn!.heapIdx = -1;
        return toReturn;
    }
    insert(p:seedPlayer) {
        this.data.push(p);
        p.heapIdx = this.data.length-1;
        this.update(this.data.length-1);
    }
    peek():seedPlayer {
        return this.data[0]
    }
    update(index:number){
        if(index<0 || index >= this.data.length) throw new Error("update method passed a bad value("+index+") for data length "+this.data.length);
        let done:boolean = false;
        while(!done) {
            let maxChildIdx = this.maxChild(index)
            if(index > 0 && this.score(parent(index)) < this.score(index)) {
            //swap with parent
                this.swap(parent(index),index)
                this.update(parent(index))
            } else if(maxChildIdx < this.data.length && this.score(maxChildIdx) > this.score(index)) {
            //swap with larger child
                this.swap(maxChildIdx,index)
                this.update(maxChildIdx)
            } else {
            //perfect
                done = true;
            }
        }
    }
    //swaps them in the array and updates the data's head indices
    swap(i1:number, i2:number) {
        let temp = this.data[i1];
        this.data[i1] = this.data[i2];
        this.data[i2] = temp;
        this.data[i1].heapIdx = i1;
        this.data[i2].heapIdx = i2;
    }
    score(index:number):number {
        return this.data[index].score;
    }
    maxChild(index:number) {
        let toReturn = 2*index+1;
        if(toReturn+1<this.data.length && this.score(toReturn+1) > this.score(toReturn)) toReturn++;
        return toReturn;
    }
    verify():void {
        for(let i = 0; i<this.data.length; i++) {
            //verify heapIdx
            assert(i == this.data[i].heapIdx);
            //verify parent child relationships
            if(i>0) assert(this.data[parent(i)].score >= this.data[i].score);
            if(this.maxChild(i)<this.data.length) assert(this.data[i].score >= this.data[this.maxChild(i)].score);
        }
    }
}
function parent(index:number) {
    return Math.floor((index-1)/2);
}
class candidateSeedGenerator {
    p:seedPlayer;
    currSeed: number;
    lowSeed: number;
    highSeed: number;
    sep: separation;
    constructor(p:seedPlayer,sep:separation) {
        this.p = p;
        this.sep = sep;
        this.currSeed = p.oldSeed;
        this.lowSeed = this.currSeed-1;
        this.highSeed = this.currSeed+1;
    }
    nextSeed():void {
        if(this.lowSeed < this.p.minSeed && this.highSeed > this.p.maxSeed) {
            this.currSeed = -1;
        } else if(this.lowSeed < this.p.minSeed) {
            this.currSeed = this.highSeed;
            this.highSeed++;
        } else if(this.highSeed > this.p.maxSeed) {
            this.currSeed = this.lowSeed;
            this.lowSeed--;
        } else if(this.sep.ratingField[this.lowSeed]/this.sep.ratingField[this.p.oldSeed] < this.sep.ratingField[this.p.oldSeed]/this.sep.ratingField[this.highSeed]){
            this.currSeed = this.lowSeed;
            this.lowSeed--;
        } else {
            this.currSeed = this.highSeed;
            this.highSeed++;
        }
    }
}

function verifyRemovedFromHeap(removedFromHeap:seedPlayer[]) {
    for(let i = 0; i<removedFromHeap.length; i++) assert(removedFromHeap[i].heapIdx == -1);
}

function separate(sep:separation, timeLimit: number): seedPlayer[] {
    let end = new Date().getTime()+timeLimit;
    let removedFromHeap:seedPlayer[] = [];
    //get players in order of how high their scores are
    //if the priority queue is empty, you're done
    while(sep.heap.data.length > 0) {
        if(testMode) {
            sep.verify();
            verifyRemovedFromHeap(removedFromHeap)
        }
        let madeSwap = false;
        //look at the first player
        let currentPlayer = sep.heap.peek()

        //testing for candidate seed generator
        let csgTestTuples:[number,number][] = []
        let currLogRating = Math.log(sep.ratingField[currentPlayer.oldSeed]);
        if(testMode) {
            for(let i = currentPlayer.minSeed; i<=currentPlayer.maxSeed; i++) {
                csgTestTuples.push([
                    Math.abs(Math.log(sep.ratingField[i])-currLogRating),
                    i
                ]);
            }
            csgTestTuples.sort();
        }
        let candidateNumber = 0
        //go thru all the possibilities for a swap(within same projected placement)
        for(let csg:candidateSeedGenerator = new candidateSeedGenerator(currentPlayer,sep); csg.currSeed != -1 && !madeSwap; csg.nextSeed()) {
            if(testMode) {
                //verify csg
                assert(candidateNumber<csgTestTuples.length);
                if((candidateNumber == 0 || csgTestTuples[candidateNumber][0]-csgTestTuples[candidateNumber-1][0]>differenceThreshold) 
                    && (candidateNumber == csgTestTuples.length-1 || csgTestTuples[candidateNumber+1][0]-csgTestTuples[candidateNumber][0]>differenceThreshold)) 
                    assert(csgTestTuples[candidateNumber][1] == csg.currSeed);
                candidateNumber++;

                sep.verify();
                verifyRemovedFromHeap(removedFromHeap)
            }

            //if you run into the time limit, you're done
            if(new Date().getTime() > end) return sep.newSeeding;

            let candidate = sep.newSeeding[csg.currSeed];
            if(candidate == currentPlayer) continue;
            let prevScore = sep.score;
            //swap the players and recalculate score
            sep.swapPlayers(currentPlayer,candidate);
            //if its lower, keep the swap, put all players that were taken out of the priority queue back in
            if(sep.score < prevScore) {
                madeSwap = true;
                while(removedFromHeap.length>0) {
                    sep.heap.insert(removedFromHeap.pop()!);
                }
                break;
            }
            //otherwise undo the swap and keep going
            else sep.swapPlayers(currentPlayer,candidate);
        }
        if(testMode){
            if(!madeSwap) assert(candidateNumber == csgTestTuples.length);
        }
        //if you go thru all candidates and none lower the score, take player 1 out of the priority queue and repeat
        if(!madeSwap) removedFromHeap.push(sep.heap.deleteMin()!);
    }
    return sep.newSeeding;
}

function adjustRatings(competitors:Competitor[]):void {
    while(true) {
        //get out of place array
        let numOutOfPlace:number[] = []
        for(let i = 0; i<competitors.length; i++) {
            numOutOfPlace.push(0);
            for(let j = 0; j<competitors.length; j++) {
                if(j == i || Math.abs(competitors[i].rating - competitors[j].rating)/competitors[j].rating<differenceThreshold) continue;
                if( (competitors[i].rating > competitors[j].rating) != (i < j)) numOutOfPlace[i]++
            }
        }
        //get players in order of how out of place they are
        let outOfPlaceTupArray:[number,number][] = []
        for(let i = 0; i<numOutOfPlace.length; i++) outOfPlaceTupArray.push([numOutOfPlace[i],i]);
        outOfPlaceTupArray.sort();
        outOfPlaceTupArray.reverse();
        //if its in order, you're done
        if(outOfPlaceTupArray[0][0] == 0) break;
        //fix most out of place player that is fixable
        let madeChange = false;
        for(let i = 0; i<outOfPlaceTupArray.length; i++) {
            let toFixIdx = outOfPlaceTupArray[i][1];
            if(toFixIdx == 0) {
                //edge case 1: first seed
                if(competitors[toFixIdx+1].rating <= competitors[toFixIdx].rating) continue;
                competitors[toFixIdx].rating = competitors[toFixIdx+1].rating;
                madeChange = true;
                break;
            } else if(toFixIdx == competitors.length-1) {
                //edge case 2: last seed
                if(competitors[toFixIdx].rating <= competitors[toFixIdx-1].rating) continue;
                competitors[toFixIdx].rating = competitors[toFixIdx-1].rating;
                madeChange = true;
                break;
            } else {
                //normal case
                if((competitors[toFixIdx+1].rating <= competitors[toFixIdx].rating && competitors[toFixIdx].rating <= competitors[toFixIdx-1].rating)
                || (competitors[toFixIdx+1].rating >= competitors[toFixIdx].rating && competitors[toFixIdx].rating >= competitors[toFixIdx-1].rating)) continue;
                competitors[toFixIdx].rating = Math.sqrt(competitors[toFixIdx-1].rating*competitors[toFixIdx+1].rating)
                madeChange = true;
                break;
            }
        }
        if(testMode) {
            if(!madeChange) {
                for(let i = 0; i<competitors.length; i++) {
                    console.log(i,competitors[i].rating);
                }
                console.log(outOfPlaceTupArray);
                assert(madeChange);
            }
        }
    }
    for(let i = 1; i<competitors.length; i++) {
        if(Math.abs(competitors[i-1].rating - competitors[i].rating)/competitors[i].rating<differenceThreshold) competitors[i].rating = competitors[i-1].rating;
    }
}