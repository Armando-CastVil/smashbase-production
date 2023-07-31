

export default function tournamentDataIsValid(tournamentData:any):number
{
   
    
        //if it doesnt return a tournament, either api key is invalid or they are not an admin of any tournaments
        //so we return
        if (tournamentData.data == undefined) {
            return 2;
        }
        //if the key is valid but the length is 0, then the user is not an admin of any tournaments
        if (tournamentData.data.currentUser.tournaments.nodes.length == 0) {
            return 3;
        }
        else
        {
            return 10;
        }
        
    
}