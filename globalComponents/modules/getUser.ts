import startGGQueryer from "../../pages/api/queryStartGG";

//function for api call
export default async function getUser(apiKey: string) {
    const query =
        `query MyUser 
            {
                currentUser 
                {
                    id
                    player 
                    {
                        id
                        gamerTag
                    }
                }
            }`
    const data = await startGGQueryer.queryStartGG(apiKey, query, {});
    return data

}