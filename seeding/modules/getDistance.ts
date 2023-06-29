import { location } from "./buildSeparationMap";
export function getDistance(loc1: location, loc2: location) {
    return calculateDistance(loc1.lat,loc1.lng,loc2.lat,loc2.lng)
}
//ChatGPT wrote this
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusMiles = 3958.8; // Radius of the Earth in miles

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2))
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusMiles * c;
  return distance;
}