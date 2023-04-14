import axios from 'axios';
import { request } from 'https';
import type { NextApiRequest, NextApiResponse } from 'next'
import {SMASHGG_API_URL} from '../../seeding/utility/config'


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
    let retries = 0;
    while (retries < 3) {
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
            retries++;
        }
    }
    return {};
}