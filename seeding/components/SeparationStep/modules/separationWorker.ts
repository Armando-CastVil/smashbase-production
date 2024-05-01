import { getDistance } from "./getDistance";
import { Carpool, Player, location } from "../../../definitions/seedingTypes";
//constants

// if 2 players location separation is less than this, don't bother
const minimumLocationSeparation = 0.01;

self.addEventListener('message', (event) => {
    const { preAvoidanceSeeding, separationFactorMap, distUnit, locationSeparationFactor, startIndex, endIndex } = event.data;
    let tasksCompleted = startIndex;
    console.log("this worker is processing players from:" + startIndex + " to " + endIndex)

    // Perform operations on the assigned chunk
    for (let i = startIndex; i < endIndex; i++) {

        let locs1 = preAvoidanceSeeding[i].locations;
        //if player has no known locations continue
        if (locs1.length === 0) 
        {

            self.postMessage({
                id1: -1,
                id2: -1,
                separationValue: -1,
            });
            continue;
        }


        for (let j = 0; j < preAvoidanceSeeding.length; j++) 
        {
            let locs2 = preAvoidanceSeeding[j].locations;
            //if the opposing player has no known distance, then skip
            if (locs2.length === 0) 
            {
                continue;
            }

            //if it doesn't have a 0 then go through the motions to find closest separation
            let closestSeparation = 0;

            for (let i1 = 0; i1 < locs1.length; i1++) 
            {
                for (let i2 = 0; i2 < locs2.length; i2++) 
                {
                    closestSeparation = Math.max(closestSeparation, getLocationSeparation(locs1[i1], locs2[i2], distUnit));
                }

            }


            //if 2 players location separation is less than this, don't bother
            if (closestSeparation < minimumLocationSeparation)
            {
                continue;
            } 

            // if we got here it means there is a value worth returning
            let id1 = preAvoidanceSeeding[i].playerID.toString();
            let id2 = preAvoidanceSeeding[j].playerID.toString();

            var separationValue = closestSeparation * locationSeparationFactor;
            self.postMessage({
                id1: id1,
                id2: id2,
                separationValue: separationValue
            });

        }
        self.postMessage({
            id1: -1,
            id2: -1,
            separationValue: -1,
        });


    }


});
//gets location separation
function getLocationSeparation(loc1: location, loc2: location, distUnit: number) {
    let distanceApart = getDistance(loc1, loc2) / distUnit
    return 0.5 ** (distanceApart ** 2) * loc1.weight * loc2.weight
}









