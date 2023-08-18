import queryFirebase from "../../../modules/queryFirebase";

export default async function fillInApiKey(user: any, currentApiKey: string | undefined) {
    

    if (currentApiKey) {
        console.log("Using currentApiKey:", currentApiKey);
        return currentApiKey;
    }

    const uid = user.uid;
    const value = await queryFirebase("apiKeys/" + uid);
    console.log("Value fetched from database:", value);

    if (value) {
        console.log("API key in db is:", value);
        return value;
    } else {
        console.log("API key not found, setting to empty string");
        return "";
    }
}
