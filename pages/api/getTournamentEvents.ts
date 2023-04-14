import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import {SMASHGG_API_URL} from '../../seeding/utility/config'

type Data = {
  name: string
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) 
{
        
    const apiKey = req.query.apiKey as string
    const slug=req.query.slug as string
    const params={apiKey,slug}
    const events = await GetTournamentEvents(params)
    
    res.status(200).json(events)
}

interface GetTournamentEvents
{
    slug:string
    apiKey:string
}

export const GetTournamentEvents = async (params:GetTournamentEvents) => {
    const graphql = 
    {
        query: 
            `query TournamentQuery($slug: String) {
                tournament(slug: $slug){
                    id
                    name
                    events(filter: {
                        videogameId: 1386,
                        type: 1
                    }) {
                        id
                        name
                        slug
                        numEntrants
                    }
                }
            }`,
        variables: 
        { 
            "slug": params.slug
        }
    }
    
    let numAttempts = 1;
    let resData;

    while (numAttempts <= 3) {
        try {
            const res = await axios.post(SMASHGG_API_URL, JSON.stringify(graphql), {
                responseType: 'json',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${params.apiKey}`
                }
            })
            
            resData = res.data;
            break;
        } catch(error) {
            console.error(`Attempt ${numAttempts} failed to get tournaments`, error)
            numAttempts++;
            if (numAttempts > 3) {
                resData = {};
            }
        }
    }

    return resData;
}