import queryFirebase from "./queryFirebase";
export default async function getRating(ID:String)
{
    let rating:number = await queryFirebase("players/"+ID+"/rating");
    if(rating==null)
    {
        
        rating = 0;
    }
    return rating
}
    
    
