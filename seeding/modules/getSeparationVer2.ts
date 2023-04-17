import Competitor from "../classes/Competitor";
import { Carpool } from "../seedingTypes";
import queryFirebase from "./queryFirebase";

export default async function getSeparationVer2(competitors:Competitor[], carpools: Carpool[], maximumFunctionRuntime?: number, conservativityParam?: number, carpoolFactorParam?: number):Promise<Competitor[]> {
    //make sure players are in order of rating
    for(let i = 1; i<competitors.length; i++) {
        if(competitors[i].rating>competitors[i-1].rating){
            throw new Error("HEY AC THE PLAYERS ARENT IN ORDER OF RATING, the player with smash gg ID of "+competitors[i].smashggID+
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

    //optional parameters
    if(typeof maximumFunctionRuntime === "undefined") {
        maximumFunctionRuntime = 3000;
    }
    if(typeof conservativityParam === "undefined") {
        conservativityParam = 30;
    }
    if(typeof carpoolFactorParam === "undefined") {
        carpoolFactorParam = 200;
    }

    //prepare each argument individually

    let ids:string[] = []
    for(let i = 0; i<competitors.length; i++) ids.push(competitors[i].smashggID);

    let separationFactorMap:{[key: string]: {[key: string]: number}} = {}
    //get separation values based on set history
    for(let i = 0; i<competitors.length; i++) {
        let id = ids[i]
        let allSetHistories = await queryFirebase("/players/"+id+"/sets");
        separationFactorMap[id] = {}
        for(let j = 0; j<competitors.length; j++) {
            let oppID = ids[j]
            if(!allSetHistories.hasOwnProperty(oppID)) continue;
            separationFactorMap[id][oppID] = allSetHistories[oppID]["sets"];
        }
    }
    //add separation values based on carpools
    for(let i = 0; i<carpools.length; i++) {
        let carpool = carpools[i]
        for(let j = 0; j<carpool.carpoolMembers.length; j++) {
            let id1 = carpool.carpoolMembers[j].smashggID;
            for(let k = 0; k<carpool.carpoolMembers.length; k++) {
                let id2 = carpool.carpoolMembers[k].smashggID;
                if(!separationFactorMap[id1].hasOwnProperty(id2)) {
                    separationFactorMap[id1][id2] = 0
                }
                separationFactorMap[id1][id2] += carpoolFactorParam;
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

    let sep:separation = new separation(separationFactorMap,ids,ratingField,projectedPaths,conservativityParam!);

    //RUN IT
    let results = separate(sep,maximumFunctionRuntime!);

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
    constructor(separationFactorMap: {[key: string]: {[key: string]: number}}, ids: string[], ratingField: number[], projectedPaths: number[][], conservativity: number) {
        //errors
        if(ratingField.length != Object.keys(separationFactorMap).length || ratingField.length != projectedPaths.length) console.log("Lengths do not match")

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
                console.log(nextMinSeed);
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
                maxSeed: Math.min(nextMinSeed-1,this.numPlayers),
                separationFactors: separationFactorMap[ids[i]]
            }


            //update score and heap
            this.updateConflictScore(newPlayer); // complete init
            newPlayer.score = newPlayer.conflictScore // complete init
            this.score += newPlayer.score; //complete init
            this.heap.insert(newPlayer); //complete init
            this.newSeeding.push(newPlayer); //complete init
            this.oldSeeding.push(newPlayer); //complete init
        }
    }
    //updates this.score and seedPlayer.score and heap in one fell swoop to ensure the heap stays accurate
    updateScoreAndHeap(p:seedPlayer):void {
        this.score += p.conflictScore + p.distScore - p.score;
        p.score = p.conflictScore + p.distScore;
        this.heap.update(p.heapIdx);
    }
    updateConflictScore(p:seedPlayer):void {
        p.conflictScore = 0;
        let opps = this.currentOpponents(p);
        for(let i = 0; i<opps.length; i++) {
            if(p.separationFactors[opps[i].id]) p.conflictScore += p.separationFactors[opps[i].id] ** 2;
        }
        p.conflictScore **= 0.5;
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
        //need to update: this.score, this.heap, this.newSeeding, 
        //seedPlayer.newSeed, seedPlayer.distScore, seedPlayer.conflictScore, seedPlayer.score, seedPlayer.heapIdx

        //calculate affectedPlayers
        let affectedPlayers:seedPlayer[] = this.currentOpponents(p1).concat(this.currentOpponents(p2))
        affectedPlayers.push(p2);
        affectedPlayers.push(p1);

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
        this.update(0);
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
}
function parent(index:number) {
    return (index-1)/2;
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
        } else if(this.sep.ratingField[this.highSeed]/this.sep.ratingField[this.p.oldSeed] > this.sep.ratingField[this.p.oldSeed]/this.sep.ratingField[this.lowSeed]){
            this.currSeed = this.lowSeed;
            this.lowSeed--;
        } else {
            this.currSeed = this.highSeed;
            this.highSeed++;
        }
    }
}

function separate(sep:separation, timeLimit: number): seedPlayer[] {
    let end = new Date().getTime()+timeLimit;
    let removedFromHeap:seedPlayer[] = [];
    //get players in order of how high their scores are
    //if the priority queue is empty, you're done
    while(sep.heap.data.length > 0) {
        let madeSwap = false;
        //look at the first player
        let currentPlayer = sep.heap.peek()
        //go thru all the possibilities for a swap(within same projected placement)
        for(let csg:candidateSeedGenerator = new candidateSeedGenerator(currentPlayer,sep); csg.currSeed != -1; csg.nextSeed()) {
            //if you run into the time limit, you're done
            if(new Date().getTime() > end) return sep.newSeeding;

            let candidate = sep.newSeeding[csg.currSeed];
            let prevScore = sep.score;
            //swap the players and recalculate score
            sep.swapPlayers(currentPlayer,candidate);
            //if its lower, keep the swap, put all players that were taken out of the priority queue back in
            if(sep.score < prevScore) {
                madeSwap = true;
                while(removedFromHeap.length>0) {
                    sep.heap.insert(removedFromHeap.pop()!);
                }
            }
            //otherwise undo the swap and keep going
            else sep.swapPlayers(currentPlayer,candidate);
            
        }
        //if you go thru all candidates and none lower the score, take player 1 out of the priority queue and repeat
        if(!madeSwap) removedFromHeap.push(sep.heap.deleteMin()!);
    }
    return sep.newSeeding;
}
