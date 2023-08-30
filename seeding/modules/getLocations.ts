import queryFirebase from "./queryFirebase";
export default async function getLocations(ID:number): Promise<[number, number][]>
{
    let locations:any = await queryFirebase("players/"+ID+"/locations");
    let toReturn:[number, number][] = []
    if(locations != null) {
        for(let i = 0; i<locations.length; i++) {
            toReturn.push([locations[i].lat,locations[i].lng])
        }
    }
    return toReturn;
}