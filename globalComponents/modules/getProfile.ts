import startGGQueryer from "../../pages/api/queryStartGG";

//function for api call
export default async function getProfileData(apiKey: string,id:string) {
    const query =
        `query ProfileData($id: ID!) 
        {
          player(id:$id ) 
          {
            id
            gamerTag
            user
            {
              images(type: "profile")
                            {
                                url
                                
                            }
            }
          }
        
        }`
    const data = await startGGQueryer.queryStartGG(apiKey, query,{id});
    return data

}