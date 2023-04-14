import axios from 'axios';
import { request } from 'https';
import type { NextApiRequest, NextApiResponse } from 'next'
import {SMASHGG_API_URL} from '../../seeding/utility/config'

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
        const entrants = await getBracketInfo(params)
        
        res.status(200).json(entrants)
}
interface GetEntrants
{
phaseGroup:number,
setsPage: number,
seedsPage: number,
apiKey: string
}


export const getBracketInfo = async (params: GetEntrants) => {
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
      "setsPerPage": 150,
      "seedsPerPage": 500
    }
  };

  let attempts = 0;
  while (attempts < 3) {
    try {
      const res = await axios.post(SMASHGG_API_URL, JSON.stringify(graphql), {
        responseType: 'json',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${params.apiKey}`
        }
      });
      return res.data;
    } catch (error) {
      console.error(`Failed to get entrants. Attempt ${attempts + 1}`, error);
      attempts++;
    }
  }

  // If we get here, it means all attempts failed
  console.error(`Could not get entrants after ${attempts} attempts`);
  return {};
}