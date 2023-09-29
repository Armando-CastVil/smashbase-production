interface Point {
  x: number;
  y: number;
  z: number;
}

interface GlobalCoordinates {
  latitude: number;
  longitude: number;
  altitude: number;
}

const EARTH_RADIUS = 3958.8; // Radius of the Earth in miles

export function toPoint(coordinates: GlobalCoordinates): Point {
  const latitudeRad = degreesToRadians(coordinates.latitude);
  const longitudeRad = degreesToRadians(coordinates.longitude);
  const altitude = coordinates.altitude;

  const x = (EARTH_RADIUS + altitude) * Math.cos(latitudeRad) * Math.cos(longitudeRad);
  const y = (EARTH_RADIUS + altitude) * Math.cos(latitudeRad) * Math.sin(longitudeRad);
  const z = (EARTH_RADIUS + altitude) * Math.sin(latitudeRad);

  return { x, y, z };
}

export function toGlobalCoordinates(point: Point): GlobalCoordinates {
  const x = point.x;
  const y = point.y;
  const z = point.z;

  const longitudeRad = Math.atan2(y, x);
  const latitudeRad = Math.atan2(z, Math.sqrt(x * x + y * y));
  const altitude = Math.sqrt(x * x + y * y + z * z) - EARTH_RADIUS;

  const latitude = radiansToDegrees(latitudeRad);
  const longitude = radiansToDegrees(longitudeRad);

  return { latitude, longitude, altitude };
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}