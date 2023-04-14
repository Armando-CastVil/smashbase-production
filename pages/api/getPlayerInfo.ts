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
) 
{
        const slug = req.query.slug as string
        const apiKey = req.query.apiKey as string
        const page=req.query.page as unknown as number
        const params={slug,page,apiKey}

        const entrants = await getPlayerInfo(params)
        
        res.status(200).json(entrants)
}
interface GetEntrants
{
slug:string,
page:number,
apiKey:string
}


export const getPlayerInfo = async (params: GetEntrants) => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const graphql = {
        query: `query EventEntrants($eventSlug: String, $perPage: Int!,$page:Int!) {
          event(slug:$eventSlug) {
            id
            name
            entrants(query: {
              page:$page
              perPage: $perPage
            }) {
              pageInfo {
                total
                totalPages
              }
              nodes {
                id
                participants {
                  id
                  gamerTag
                  player
                  {
                    id
                  }
                }
              }
            }
          }
        }`,
        variables: {
          "eventSlug": params.slug,
          "perPage": 420,
          "page": params.page
        }
      }

      const res = await axios.post(SMASHGG_API_URL, JSON.stringify(graphql), {
        responseType: 'json',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${params.apiKey}`
        }
      })
      return res.data;
    } catch (error) {
      console.error("failed to get tournaments", error);
      retryCount++;
    }
  }

  // If we've exhausted all retries and the request still failed, return an empty object
  return {};
}