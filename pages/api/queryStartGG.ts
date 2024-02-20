// TO READ, START AT "CORE CODE"
import { log } from '../../globalComponents/modules/logs';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import ErrorCode from '../../seeding/components/ApiKeyStep/modules/enums';
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
const TIME_PER_REFRESH = 60000
const SMASHGG_API_URL = 'https://api.smash.gg/gql/alpha'
const DEFAULT_RETRIES = 50
export default class startGGQueryer {
    // start gg only lets you get a limited # of queries per minute
    // this variable represents the timestamp when your queries should be refreshed
    static nextRefresh = Date.now() + TIME_PER_REFRESH //in ms
    static refreshed(): boolean {
        return Date.now() >= this.nextRefresh
    }
    static isResponseError(res:AxiosResponse): boolean {
        return !res.data.hasOwnProperty("data")
    }
    static tooManyRequests(error:any) {
        return error instanceof AxiosError && error.message == "Request failed with status code 429"
    }
    static invalidAPIkey(error:any) {
        return error instanceof AxiosError && error.response && (error.response.data.message == 'Invalid authentication token' || error.response.data.message == 'Token has expired.')
    }
    static async queryStartGG(apiKey:string,query:string,variables:any,retries:number=DEFAULT_RETRIES): Promise<any> {
        if(retries == DEFAULT_RETRIES) {
            log('Querying Start.gg: '+JSON.stringify({'query': query, 'variables': variables}))
        }
        function handleResponseError(res:AxiosResponse) {
            log("RESPONSE ERROR: ")
            if(retries == 0) {
                throw new Error("Ran out of retries")
            } else {
                log(res.data)
                return startGGQueryer.queryStartGG(apiKey,query,variables,retries-1)
            }
        }
        const contents = JSON.stringify({
            query: query,
            variables: variables
        })
        const axiosSettings:AxiosRequestConfig = {
            responseType: 'json',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        }

        //CORE CODE
        if(this.refreshed()) {
            this.nextRefresh = Date.now() + TIME_PER_REFRESH
        }
        try {
            const res = await axios.post(SMASHGG_API_URL, contents, axiosSettings)
            if(this.isResponseError(res)) {
                handleResponseError(res)
            } else {
                log('Start GG response: '+JSON.stringify(res.data))
                return res.data.data
            }
        } catch(error) {
            if(this.tooManyRequests(error)) {
                log('Too Many Requests, sleeping until '+this.nextRefresh)
                await sleep(this.nextRefresh-Date.now())
            } else if(this.invalidAPIkey(error)) {
                log('Invalid Api Key: '+apiKey)
                throw new Error(ErrorCode.InvalidAPIKey+"")
            } else {
                log(error)
            }
            if(retries == 0) {
                throw error
            } else {
                log(error)
                return this.queryStartGG(apiKey,query,variables,retries-1)
            }
        }

    }
}