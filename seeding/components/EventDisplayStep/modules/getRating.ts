import queryFirebase from "../../../modules/queryFirebase";
export const defaultRating = 0.36
export default async function getRating(ID:number)
{
    let rating:number = await queryFirebase("players/"+ID+"/rating");
    if(rating==null || rating<=0)
    {
        
        rating = defaultRating;
    }
    return rating
}