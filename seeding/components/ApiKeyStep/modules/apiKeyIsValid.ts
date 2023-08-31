import ErrorCode from "./enums";
export default function apiKeyIsValid(apiKey:string|undefined)
{
    
    //if no api key is entered by the user, they are made aware and function is exited
    if (apiKey == undefined || apiKey.length == 0) {
        return ErrorCode.EmptyAPIKey
    }
    else
    {
        return ErrorCode.None;
    }
}