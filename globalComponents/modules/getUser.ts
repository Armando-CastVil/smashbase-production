import getUserData from "./getUserData";
import { User } from "./globalTypes";
import queryFirebase from "./queryFirebase";

export default async function getUser(apiKey: string): Promise<User> {
    let userData = await getUserData(apiKey);
    let startGGID:number = userData['currentUser']['player']['id'];
    let userName:string = userData['currentUser']['player']['gamerTag'];
    let images:any[] = userData['currentUser']['images'];
    let profilePicture:string|undefined = undefined;
    let pfpWidth:number|undefined = undefined;
    let pfpHeight:number|undefined = undefined;
    if(images.length > 0) {
        profilePicture = images[0]['url'];
        pfpHeight = images[0]['height'];
        pfpWidth = images[0]['width'];
    }
    let rating: number | undefined = await queryFirebase('players/'+startGGID+'/rating');
    let toReturn:User = {
        startGGID,
        userName,
        profilePicture,
        pfpHeight,
        pfpWidth,
        rating,
        apiKey
    }
    return toReturn;
}