import axios from 'axios';
import {SMASHGG_API_URL} from '../../seeding/utility/config'
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
export default async function queryStartGG(apiKey:string,query:string,variables:any,retries:number=50): Promise<any> {
    const graphql = {
        query: query,
        variables: variables
    }
    try {
        await sleep(760)
        const res = await axios.post(SMASHGG_API_URL, JSON.stringify(graphql), {
            responseType: 'json',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        })
        if(!res.data.hasOwnProperty("data")) {
            if(retries == 0) {
                console.error(res.data.message)
            }
            else return queryStartGG(apiKey,query,variables,retries-1)
        } else {
            return res.data.data
        }
    } catch(error) {
        if(retries == 0) {
            console.error(error)
        }
        else return queryStartGG(apiKey,query,variables,retries-1)
    }
}