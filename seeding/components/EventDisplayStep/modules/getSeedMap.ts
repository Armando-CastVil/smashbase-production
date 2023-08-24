
export default function getSeedMap(seedData:any):{[key: number]: number} {
    let seedMap:{[key: number]: number} = {}
    for(let i = 0; i<seedData.length; i++) {
        let json = seedData[i];
        seedMap[json.id] = json.seedNum-1
    }
    return seedMap
}