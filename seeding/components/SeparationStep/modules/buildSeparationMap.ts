import { sep } from "node:path/win32";
import { Carpool, Player, location } from "../../../definitions/seedingTypes";
import { toPoint, toGlobalCoordinates } from "./coordsAndPoints";
import { getDistance } from "./getDistance";


// if 2 players location separation is less than this, don't bother
const minimumLocationSeparation = 0.01;
//start of main function
export default async function buildSeparationMap(
    setProgress: (value: [number, number]) => void,
    preAvoidanceSeeding: Player[],
    carpools: Carpool[],
    historySeparationFactor: number,
    locationSeparationFactor: number,
    carpoolFactorParam: number = 1000,
    customSeparations: [string, string, number][] = [] // array of 3-tuples each in the format: [id1, id2, factor to separate these 2 by]
): Promise<{ [key: string]: { [key: string]: number; }; }> {

    // a variable that holds a nested dictionary structure,where the keys are strings and the value is a number
    //probably in the format array of 3-tuples each in the format: [id1, id2, factor to separate these 2 by]
    let separationFactorMap: { [key: string]: { [key: string]: number } } = {}

    //initializes separationFactorMap with id1 as the initial key, it is initialized as an empty object
    for (let i = 0; i < preAvoidanceSeeding.length; i++) {
        separationFactorMap[preAvoidanceSeeding[i].playerID.toString()] = {}
    }


    let spread = getSpread(preAvoidanceSeeding)
    if (isNaN(spread)) spread = 90
    let distUnit = Math.max(Math.min(spread / 3, 300), 20)
    addSetHistorySeparation(separationFactorMap, preAvoidanceSeeding, historySeparationFactor);
    addCarpoolSeparation(separationFactorMap, carpools, carpoolFactorParam);



    //create web workers
    const numWorkers = 6;

    // Create and initialize web workers
    const workers: Worker[] = [];

    // Create a single promise to track the completion of all workers
    const allWorkersPromise = new Promise<void>((resolve) => {
        // Create and initialize web workers
        for (let i = 0; i < numWorkers; i++) {
            const worker = new Worker(new URL('separationWorker.ts', import.meta.url));
            workers.push(worker);
        }

        // Receive messages from workers
        let completedPlayers = 0;
        workers.forEach(worker => {

            worker.addEventListener('message', (event) => {


                const { id1, id2, separationValue } = event.data;
                if (separationValue === -1) {
                    completedPlayers++;
                    console.log("completed player")
                    //setProgress([completedPlayers,preAvoidanceSeeding.length])
                }


                if (separationValue !== -1) {
                    if (!separationFactorMap[id1].hasOwnProperty(id2)) {
                        separationFactorMap[id1][id2] = 0
                    }

                    separationFactorMap[id1][id2] += separationValue


                }





                if (completedPlayers === (preAvoidanceSeeding.length)) {
                    console.log("All workers completed. Resolving all promises.");
                    console.log("Num players in separation factor map:", separationFactorMap);
                    resolve();
                }
            });
        });

        // Put the workers to work
        for (let i = 0; i < workers.length; i++) {
            // Calculate the start and end indices for the worker's chunk
            const chunkSize = Math.ceil(preAvoidanceSeeding.length / numWorkers);
            const startIndex = i * chunkSize;
            const endIndex = Math.min((i + 1) * chunkSize, preAvoidanceSeeding.length);
            workers[i].postMessage({
                preAvoidanceSeeding: preAvoidanceSeeding,
                separationFactorMap: separationFactorMap,
                distUnit: distUnit,
                locationSeparationFactor: locationSeparationFactor,
                startIndex: startIndex,
                endIndex: endIndex
            });
        }
    });

    // Wait for all worker promises to resolve
    await allWorkersPromise;
    // Terminate all workers
    workers.forEach(worker => {
        console.log("terminating worker")
        worker.terminate();
    });
    removeMirrorSeparation(separationFactorMap, preAvoidanceSeeding);
    console.log("separation factor map:")
    console.log(separationFactorMap)
    console.log("returning separation map")
    return separationFactorMap;












}

//start of getSpread function
function getSpread(preAvoidanceSeeding: Player[]): number {
    //first get avg
    let sumX = 0
    let sumY = 0
    let sumZ = 0
    let count = 0
    // this section calculates the best location
    for (let i = 0; i < preAvoidanceSeeding.length; i++) {
        let highestWeight = 0
        let bestLocation: location;
        for (let j = 0; j < preAvoidanceSeeding[i].locations.length; j++) {
            if (preAvoidanceSeeding[i].locations[j].weight > highestWeight) {
                highestWeight = preAvoidanceSeeding[i].locations[j].weight
                bestLocation = preAvoidanceSeeding[i].locations[j]
            }
        }
        if (highestWeight < 0.2) continue
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

    //grabs the best location and converts it to coordinates
    let avgCoords = toGlobalCoordinates({
        'x': sumX / count,
        'y': sumY / count,
        'z': sumZ / count
    })
    let avgLocation: location = {
        'lat': avgCoords.latitude,
        'lng': avgCoords.longitude,
        'weight': 1
    }

    //now get sd
    let sumOfSquares = 0;
    for (let i = 0; i < preAvoidanceSeeding.length; i++) {
        let highestWeight = 0
        let bestLocation: location;
        for (let j = 0; j < preAvoidanceSeeding[i].locations.length; j++) {
            if (preAvoidanceSeeding[i].locations[j].weight > highestWeight) {
                highestWeight = preAvoidanceSeeding[i].locations[j].weight
                bestLocation = preAvoidanceSeeding[i].locations[j]
            }
        }
        if (highestWeight < 0.2) continue
        sumOfSquares += (getDistance(bestLocation!, avgLocation)) ** 2
    }
    return (sumOfSquares / count) ** 0.5
}
//adds set history separation
function addSetHistorySeparation(separationFactorMap: { [key: string]: { [key: string]: number } }, preAvoidanceSeeding: Player[], historySeparationFactor: number): void {
    for (let i = 0; i < preAvoidanceSeeding.length; i++) {
        let currPlayer = preAvoidanceSeeding[i];
        let id = currPlayer.playerID.toString()
        for (const oppID in currPlayer.setHistories) {
            if (!currPlayer.setHistories.hasOwnProperty(oppID)) continue;
            if (!separationFactorMap[id].hasOwnProperty(oppID)) separationFactorMap[id][oppID] = 0
            separationFactorMap[id][oppID] += currPlayer.setHistories[oppID] * historySeparationFactor;
        }
    }
}
function addCarpoolSeparation(separationFactorMap: { [key: string]: { [key: string]: number } }, carpools: Carpool[], carpoolFactorParam: number): void {
    for (let i = 0; i < carpools.length; i++) {
        let carpool: Carpool = carpools[i]
        for (let j = 0; j < carpool.carpoolMembers.length; j++) {
            let id1: string = carpool.carpoolMembers[j].toString();
            for (let k = 0; k < carpool.carpoolMembers.length; k++) {
                let id2: string = carpool.carpoolMembers[k].toString();
                if (!separationFactorMap[id1].hasOwnProperty(id2)) separationFactorMap[id1][id2] = 0
                separationFactorMap[id1][id2] += carpoolFactorParam;
            }
        }
    }
}


//removes mirror separation
function removeMirrorSeparation(separationFactorMap: { [key: string]: { [key: string]: number } }, preAvoidanceSeeding: Player[]) {
    for (let i = 0; i < preAvoidanceSeeding.length; i++) {
        let id = preAvoidanceSeeding[i].playerID.toString()
        delete separationFactorMap[id][id];
    }
}


//function for future implementation of custom separation
function setCustomSeparation(separationFactorMap: { [key: string]: { [key: string]: number } }, customSeparations: [string, string, number][]): void {
    for (let i = 0; i < customSeparations.length; i++) {
        let id1 = customSeparations[i][0]
        let id2 = customSeparations[i][1]
        separationFactorMap[id1][id2] = customSeparations[i][2]
        separationFactorMap[id2][id1] = customSeparations[i][2]
    }
}
