import axios from "axios"
import { isWhitelisted, sha256 } from "../../utility/whitelist";



const INVALID_API_KEY = "This API key is not valid";
const INVALID_URL = "This URL is not valid. It should be in the format: start.gg/tournament/[tournament name]/event/[event name]";
const NOT_AN_ADMIN = "The owner of this API key is not an admin of the tournament";
const NOT_WHITELITED = "This API key is not whitelisted. Please contact me thru discord(@Stephen Schu#0995) or twitter(@Stephen_Schu_) to whitelist your key and send me this hashed API key: ";
export const OK = "OK";

//takes in the url and api key and returns empty string if they work and the reason they don't if they don't
export default async function verifyKeyAndURL(slug: string, apiKey: string):Promise<string> {
    
    if(slug === undefined) return INVALID_URL;
    const data = await APICall(slug,apiKey);
    if(data.data === undefined) {
        return INVALID_API_KEY;
    } else if(!(await isWhitelisted(apiKey))) {
        return NOT_WHITELITED+ await sha256(apiKey);
    } else if(data.data.event === null) {
        return INVALID_URL;
    } else if(data.data.event.tournament.admins === null) {
        return NOT_AN_ADMIN;
    } else return OK;
}
function APICall(slug:string,apiKey:string)
{
    //API call
    return axios.get('api/getAdmins',{params:{slug:slug,apiKey:apiKey}}).then(({data})=>
        {
            console.log("getting admins")
            console.log(data)
            return data
        }
    )
}