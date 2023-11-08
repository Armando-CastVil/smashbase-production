import startGGQueryer from "../../pages/api/queryStartGG";

//function for api call
export default async function getUserData(apiKey: string) {
    const query =
        `query MyUser 
            {
                currentUser 
                {
                    images(type: "profile")
                    {
                        url
                        height
                        width
                    }
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