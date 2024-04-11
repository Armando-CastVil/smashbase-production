import { getDistance } from "./getDistance";
import { Carpool, Player, location } from "../../../definitions/seedingTypes";
//constants

// if 2 players location separation is less than this, don't bother
const minimumLocationSeparation = 0.01;

self.addEventListener('message', (event) => {
    const { preAvoidanceSeeding, separationFactorMap, distUnit, locationSeparationFactor, startIndex, endIndex } = event.data;
    let tasksCompleted = startIndex;
    console.log("this worker is processing players from:" +startIndex+" to "+ endIndex)
  
    // Perform operations on the assigned chunk
    for (let i = startIndex; i < endIndex; i++) {
       
      let locs1 = preAvoidanceSeeding[i].locations;
      if (locs1.length === 0)
      {
        tasksCompleted++
        console.log("tasks completed: "+tasksCompleted)
        self.postMessage(tasksCompleted)
        continue;
      } 
  
      for (let j = 0; j < preAvoidanceSeeding.length; j++) {
        let locs2 = preAvoidanceSeeding[j].locations;
        if (locs2.length === 0) continue;
  
        let closestSeparation = 0;
        for (let i1 = 0; i1 < locs1.length; i1++) {
          for (let i2 = 0; i2 < locs2.length; i2++) {
            closestSeparation = Math.max(closestSeparation, getLocationSeparation(locs1[i1], locs2[i2], distUnit));
          }
        }
  
        if (closestSeparation < minimumLocationSeparation) continue;
  
        let id1 = preAvoidanceSeeding[i].playerID.toString();
        let id2 = preAvoidanceSeeding[j].playerID.toString();
  
        if (!separationFactorMap[id1].hasOwnProperty(id2)) {
          separationFactorMap[id1][id2] = 0;
        }
  
        separationFactorMap[id1][id2] += closestSeparation * locationSeparationFactor;
      
      }
      tasksCompleted++
      console.log("tasks completed: "+tasksCompleted)
      self.postMessage(tasksCompleted)
    }
  
    
  });
//gets location separation
function getLocationSeparation(loc1: location, loc2: location, distUnit: number) {
    let distanceApart = getDistance(loc1, loc2) / distUnit
    return 0.5 ** (distanceApart ** 2) * loc1.weight * loc2.weight
}









