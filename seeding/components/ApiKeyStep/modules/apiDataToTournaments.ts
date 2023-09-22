
import defaultTournamentPFP from "../../../../assets/seedingAppPics/logo.jpg";
import { Tournament } from "../../../definitions/seedingTypes";


//this function handles the data returned by the api call
export default function apiDataToTournaments(apiData: any) {
    //tournaments are stored here
    let tournamentArray: Tournament[] = [];
    //if we made it to here it is because there is data, this is then processed
    for (
        let i = 0;
        i < apiData.currentUser.tournaments.nodes.length;
        i++
    ) {
        let name: string = apiData.currentUser.tournaments.nodes[i].name;
        let city: string = apiData.currentUser.tournaments.nodes[i].city;
        let url: string = apiData.currentUser.tournaments.nodes[i].url;
        let slug: string = apiData.currentUser.tournaments.nodes[i].slug;
        let startAt: number =
            apiData.currentUser.tournaments.nodes[i].startAt;
        let imageURL = undefined;
        if (apiData.currentUser.tournaments.nodes[i].images.length != 0) {
            imageURL =
                apiData.currentUser.tournaments.nodes[i].images[0].url;
        }
        else
        {
            imageURL=undefined
        }
        let tempTournament:Tournament = {
            name:name,
            city:city,
            url:city,
            slug:slug,
            startAt:startAt,
            imageURL:imageURL
        };
        tournamentArray.push(tempTournament);
    }

    return tournamentArray;
}
