export default function apiKeyIsValid(apiKey:string|undefined)
{
    console.log("api key is valid function")
     //if no api key is entered by the user, they are made aware and function is exited
     if (apiKey == undefined || apiKey.length == 0) {
        return 1
    }
    //check if not whitelisted
    if (apiKey == "not whitelisted") {
        return 6
    }
    else
    {
        return 0;
    }
}