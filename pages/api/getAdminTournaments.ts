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
        const params={apiKey}
        const tournaments = await GetAdminTournaments(params)
        
        res.status(200).json(tournaments)
}
interface GetAdminTournaments
{

apiKey:string
}



// AJAX functions
export const GetAdminTournaments = async (params:GetAdminTournaments ) => {
  
  
    const graphql = 
    {
        query: 
            `query TournamentsByOwner($perPage: Int!) {
                currentUser {
                  tournaments(query: {
                    filter: {
                      tournamentView: "admin"
                      upcoming:true
                    }
                    perPage: $perPage
                  }) {
                    nodes {
                    name
                    city
                    url
                    slug
                    startAt
                    images{
                      url
                    }
                    }
                  }
                }
            }`,
        variables: 
        { 
            "perPage":69,     
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