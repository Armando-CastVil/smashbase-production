import queryFirebase from "../../../modules/queryFirebase";

//fills in api key
export default function fillInApiKey(user: any, currentApiKey: string | undefined) {

    //variable to hold the api key that will be fetched from database
    let apiKeyToReturn: string | undefined;

    if (currentApiKey !== "") {
        apiKeyToReturn = currentApiKey
    }
    const uid = user.uid;
    //pull it from firebase
    queryFirebase("apiKeys/" + uid, 0).then((value) => {
        //check if not whitelisted
        if (value == "not whitelisted") {
            apiKeyToReturn = value
        }
        //check firebase first
        else if (value != null) {
            apiKeyToReturn = value
        } else {
            //if its in neither place, just set it to empty string
            apiKeyToReturn = "";
        }
    });

    return apiKeyToReturn
}