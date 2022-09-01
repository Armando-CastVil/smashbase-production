import axios from 'axios';
import { request } from 'https';
import type { NextApiRequest, NextApiResponse } from 'next'
import {SMASHGG_API_URL} from '../utility/config'

type Data = {
  name: string
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) 
{
        const slug = req.query.slug as string
        const apiKey = req.query.apiKey as string
        
        const params={slug,apiKey}

        const entrants = await GetPhaseGroups(params)
        
        res.status(200).json(entrants)
}
interface GetPhaseGroups
{
slug:string,
apiKey:string
}


// AJAX functions
export const GetPhaseGroups = async (params: GetPhaseGroups) => {
  
    const graphql = 
    {
        query: 
            `query EventEntrants($eventSlug: String) 
            {
                event(slug:$eventSlug) 
                {
                    id
                    name
                    phaseGroups 
                    {
                        id
                    }
                }
            }`,
        variables: 
        { 
            "eventSlug":params.slug,     
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
        console.error("failed to get tournament", error)
        return {}
    }
  }