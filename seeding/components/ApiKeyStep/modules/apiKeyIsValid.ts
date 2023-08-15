import ErrorCode from "./enums";
export default function apiKeyIsValid(apiKey:string|undefined)
{
    console.log("api key is valid function")
     //if no api key is entered by the user, they are made aware and function is exited
     if (apiKey == undefined || apiKey.length == 0) {
        return ErrorCode.EmptyAPIKey
    }
    //check if not whitelisted
    if (apiKey == "not whitelisted") {
        return ErrorCode.NotWhitelisted
    }
    else
    {
        return ErrorCode.None;
    }
}