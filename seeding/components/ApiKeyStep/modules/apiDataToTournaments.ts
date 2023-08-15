import Tournament from "../../../classes/Tournament";


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
            imageURL="https://www.bing.com/th?pid=Sgg&qlt=100&u=https%3A%2F%2Fimages.start.gg%2Fimages%2Ftournament%2F498307%2Fimage-d528d92db0843f22bfe59c3092c7bda3-optimized.jpg&ehk=D1812KBaWpQBzyfxDX9qvqaZ3hCPUTKRhXZyayrMips%3D&w=280&h=280&r=0"
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
