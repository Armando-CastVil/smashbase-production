import startGGQuerier from '../../../../pages/api/queryStartGG';
import { Player } from '../../../definitions/seedingTypes';
export type UpdatePhaseSeedInfo = {
    seedId: number,
    seedNum: number
}

const pushSeedingQuery = `mutation thing($phaseId: ID!, $seedMapping: [UpdatePhaseSeedInfo]!) {
    updatePhaseSeeding(phaseId: $phaseId, seedMapping: $seedMapping) {
        id
    }
}`

export default async function pushSeeding(competitorSeeding:Player[], phaseId: number, apiKey: string): Promise<boolean>
{
    
    let seedMapping:UpdatePhaseSeedInfo[] = [];
    for(let i = 0; i<competitorSeeding.length; i++) {
        seedMapping.push({
            seedNum:i+1,
            seedId: competitorSeeding[i].seedID!
        })
    }
    let response = await startGGQuerier.queryStartGG(apiKey,pushSeedingQuery,{'phaseId': phaseId,'seedMapping':seedMapping})
    return response.updatePhaseSeeding != undefined
}