import Tournament from "../../../classes/Tournament";
import defaultTournamentPFP from "assets/seedingAppPics/logo.jpg";


//this function handles the data returned by the api call
export default function apiDataToTournaments(apiData: any) {
    //tournaments are stored here
    let tournamentArray: Tournament[] = [];
    console.log("apidata in apidatatotournaments function:")
    console.log(apiData)
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
            imageURL=defaultTournamentPFP
        }
        let tempTournament = new Tournament(
            name,
            city,
            url,
            slug,
            startAt,
            imageURL
        );
        tournamentArray.push(tempTournament);
    }

    return tournamentArray;
}
