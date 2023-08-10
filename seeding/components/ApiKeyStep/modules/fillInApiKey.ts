import queryFirebase from "../../../modules/queryFirebase";

export default async function fillInApiKey(user: any, currentApiKey: string | undefined) {
    

    if (currentApiKey) {
        console.log("Using currentApiKey:", currentApiKey);
        return currentApiKey;
    }

    const uid = user.uid;
    try {
        const value = await queryFirebase("apiKeys/" + uid, 0);
        console.log("Value fetched from database:", value);

        if (value === "not whitelisted") {
            console.log("API key is not whitelisted");
            return value;
        } else if (value) {
            console.log("API key in db is:", value);
            return value;
        } else {
            console.log("API key not found, setting to empty string");
            return "";
        }
    } catch (error) {
        console.error("Error fetching API key:", error);
        return "";
    }
}
