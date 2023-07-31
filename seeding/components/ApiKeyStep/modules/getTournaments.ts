import axios from "axios";

//function for api call
export default async function getTournaments(apiKey: string) {
    //API call
    return axios
        .get("api/getAdminTournaments", { params: { apiKey: apiKey } })
        .then(({ data }) => {
            return data;
        });
}