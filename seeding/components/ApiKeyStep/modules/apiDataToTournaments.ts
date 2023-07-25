import Tournament from "../../../classes/Tournament";


//this function handles the data returned by the api call
export default function apiDataToTournaments(apiData: any) {
    //tournaments are stored here
    let tournamentArray: Tournament[] = [];
    //data is undefined if an invalid key was provided by user
    if (apiData.data == undefined) {
        return tournamentArray;
    } else {
        //if we made it to here it is because there is data, this is then processed
        for (
            let i = 0;
            i < apiData.data.currentUser.tournaments.nodes.length;
            i++
        ) {
            let name: string = apiData.data.currentUser.tournaments.nodes[i].name;
            let city: string = apiData.data.currentUser.tournaments.nodes[i].city;
            let url: string = apiData.data.currentUser.tournaments.nodes[i].url;
            let slug: string = apiData.data.currentUser.tournaments.nodes[i].slug;
            let startAt: number =
                apiData.data.currentUser.tournaments.nodes[i].startAt;
            let imageURL = undefined;
            if (apiData.data.currentUser.tournaments.nodes[i].images.length != 0) {
                imageURL =
                    apiData.data.currentUser.tournaments.nodes[i].images[0].url;
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
    }

    return tournamentArray;
}
