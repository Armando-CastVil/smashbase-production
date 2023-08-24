import startGGQueryer from "../../../../pages/api/queryStartGG";
export default async function getPhaseAndPhaseGroupIDs(apiKey:string, slug: string): Promise<[number[],number[]]> {
    const query = `query phaseGroups($slug: String) {
        event(slug: $slug) {
            phaseGroups {
                id
            }
            phase {
                id
            }
        }
    }`
    const variables = {
        "slug": slug
    }
    return dataToArray(await startGGQueryer.queryStartGG(apiKey, query, variables))
}

function dataToArray(data:any): [number[], number[]] {
    var phaseGroupObjs = data.event.phaseGroups;
    let phaseGroupIDs:number[] = []
    for(let i = 0; i<phaseGroupObjs.length; i++) {
        phaseGroupIDs.push(phaseGroupObjs[i].id)
    }
    var phaseObjs = data.event.phases;
    let phaseIDs:number[] = []
    for(let i = 0; i<phaseObjs.length; i++) {
        phaseIDs.push(phaseObjs[i].id)
    }
    return [phaseIDs, phaseGroupIDs]
}