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
  const slug = req.query.slug as string
  const apiKey = req.query.apiKey as string
  const params={slug,apiKey}
  
  let entrants = null;
  
  for (let i = 1; i <= 3; i++) {
    try {
      entrants = await GetPhaseGroups(params);
      break;
    } catch(error) {
      console.error(`Attempt ${i} to get phase groups failed.`, error)
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second before retrying
    }
  }
  
  if (entrants) {
    res.status(200).json(entrants);
  } else {
    res.status(500).send("Failed to get phase groups.");
  }
}

interface GetPhaseGroups {
  slug: string,
  apiKey: string
}

export const GetPhaseGroups = async (params: GetPhaseGroups) => {
  const graphql = {
    query: `query EventEntrants($eventSlug: String) 
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
    variables: {
      "eventSlug": params.slug,
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
}