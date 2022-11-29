import axios from 'axios';
import { request } from 'https';
import type { NextApiRequest, NextApiResponse } from 'next'
import {SMASHGG_API_URL} from '../utility/config'

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<any>
// ) 
// {
//     console.log(req.query.seedMapping);
//         const phaseId = req.query.phaseId as unknown as number;
//         const seedMapping = req.query.seedMapping as unknown as [UpdatePhaseSeedInfo];
//         const apiKey = req.query.apiKey as string;
//         const params={phaseId,seedMapping,apiKey}

//         console.log(await mutateSeeding(params));
        
//         res.status(200)
// }
interface MutateSeeding
{
    phaseId: number,
    seedMapping: UpdatePhaseSeedInfo[],
    apiKey: string
}
export type UpdatePhaseSeedInfo = {
    seedId: number,
    seedNum: number
}


// AJAX functions
export const mutateSeeding = async (params: MutateSeeding) => {
  console.log("mutating seeding of phase: "+ params.phaseId)
  console.log(params.seedMapping);
    const graphql = {
        query: `mutation thing($phaseId: ID!, $seedMapping: [UpdatePhaseSeedInfo]!) {
                updatePhaseSeeding(phaseId: $phaseId, seedMapping: $seedMapping) {
                    id
                }
            }`,
        variables: { 
            "phaseId": params.phaseId,
            "seedMapping": params.seedMapping
        }
    }
    try {
        const res = await axios.post(SMASHGG_API_URL, JSON.stringify(graphql), {
            responseType: 'json',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${params.apiKey}`
            }
        })
        return res.data;
    } catch(error) {
        console.error("failed to mutate seeding", error)
        return {}
    }
  }