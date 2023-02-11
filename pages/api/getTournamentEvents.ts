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



// AJAX functions
export const GetTournamentEvents = async (params:GetTournamentEvents ) => {
  
  
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
        console.error("failed to get tournaments", error)
        return {}
    }
  }