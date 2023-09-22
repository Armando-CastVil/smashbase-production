import queryFirebase from "../../../../globalComponents/modules/queryFirebase";

export default async function fillInApiKey(user: any, currentApiKey: string | undefined) {

    if (currentApiKey) {
        return currentApiKey;
    }

    const uid = user.uid;
    const value = await queryFirebase("apiKeys/" + uid);

    if (value) {
        return value;
    } else {
        return "";
    }
}
