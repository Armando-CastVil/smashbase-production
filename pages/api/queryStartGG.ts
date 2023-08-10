// TO READ, START AT "CORE CODE"

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {SMASHGG_API_URL} from '../../seeding/utility/config'
function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
const TIME_PER_REFRESH = 61*1000
export default class startGGQueryer {
    // start gg only lets you get a limited # of queries per minute
    // this variable represents the timestamp when your queries should be refreshed
    static nextRefresh = 0 //in ms
    static refreshed(): boolean {
        return Date.now() >= this.nextRefresh
    }
    static isResponseError(res:AxiosResponse): boolean {
        return !res.data.hasOwnProperty("data")
    }
    static tooManyRequests(error:any) {
        return error instanceof AxiosError && error.message == "Request failed with status code 429"
    }
    static async queryStartGG(apiKey:string,query:string,variables:any,retries:number=50): Promise<any> {
        function handleResponseError(res:AxiosResponse) {
            console.log("RESPONSE ERROR: ")
            if(retries == 0) {
                throw new Error()
            } else {
                console.log(res.data)
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
                return res.data.data
            }
        } catch(error) {
            if(this.tooManyRequests(error)) {
                await sleep(this.nextRefresh-Date.now())
            } else {
                console.log(error)
            }
            if(retries == 0) {
                throw error
            } else {
                return this.queryStartGG(apiKey,query,variables,retries-1)
            }
        }

    }
}