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
) {
        
        const phaseGroup=req.query.phaseGroup as unknown as number
        const seedsPage=req.query.seedsPage as unknown as number
        const setsPage=req.query.seedsPage as unknown as number
        const apiKey=req.query.apiKey as string
        const params={phaseGroup,seedsPage,setsPage,apiKey}
        const entrants = await getEntrants(params)
        
        res.status(200).json(entrants)
}
interface GetEntrants
{
phaseGroup:number,
setsPage: number,
seedsPage: number,
apiKey: string
}


// AJAX functions
export const getEntrants = async (params: GetEntrants) => {
  console.log("ths is an api call with phaseGroup:" + params.phaseGroup+ " setpage: "+params.setsPage+" and seedspage: "+ params.seedsPage)
    const graphql = {
        query: `query sets($phaseGroup: ID!, $seedsPerPage: Int, $seedsPage: Int, $setsPerPage: Int, $setsPage: Int) {
          phaseGroup(id: $phaseGroup) {
              phase {
                id
              }
          
              seeds(query: {
                perPage: $seedsPerPage
                page: $seedsPage
              }) {
                nodes {
                  players {
                    id
                    gamerTag
                  }
                  id
                  progressionSource {
                    id
                  }
                  seedNum
                }
              }
              progressionsOut {
                id
              }
              sets(perPage: $setsPerPage, page: $setsPage, filters: {
                showByes: true
              }) {
                nodes {
                  id
                  identifier
                  round
                  slots(includeByes: false) {
                    prereqId
                    prereqType
                    seed {
                      id
                    }
                  }
                }
              }
            }
          }`,
        variables: {
            
          
            "phaseGroup":params.phaseGroup,
            "setsPage": params.setsPage,
            "seedsPage": params.seedsPage,
            "setsPerPage": 200,
            "seedsPerPage": 500
          
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