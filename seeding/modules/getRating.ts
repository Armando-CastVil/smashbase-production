import queryFirebase from "./queryFirebase";
export const defaultRating = 0.125
export default async function getRating(ID:String)
{
    let rating:number = await queryFirebase("players/"+ID+"/rating");
    if(rating==null)
    {
        
        rating = defaultRating;
    }
    return rating
}
    
    
