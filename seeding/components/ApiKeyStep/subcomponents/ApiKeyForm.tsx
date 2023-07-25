
import stepStyles from "../../../../styles/ApiKeyStep.module.css";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../utility/firebaseConfig";
import { getAuth } from "firebase/auth";
import writeToFirebase from "../../../modules/writeToFirebase";
import axios from "axios";
import Tournament from "../../../classes/Tournament";
import apiDataToTournaments from "../modules/apiDataToTournaments";

interface props {
    errorCode: number
    setErrorCode: (errorCode: number) => void
    apiKey: string | undefined;
    setApiKey: (ApiKey: string) => void;
    setTournaments: (tournaments: Tournament[]) => void;
    page: number;
    setPage: (page: number) => void;
}

//Initialize Firebase configuration
export const ApiApp = initializeApp(firebaseConfig);
const auth = getAuth();

export default function ApiKeyForm({ errorCode, setErrorCode, apiKey, setApiKey, setTournaments, page, setPage }: props) {

    let keyIsGood = false;

    function handleKeyPress(event: { key: string; preventDefault: () => void }) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            handleSubmit();
        }
    }

    //this function handles the user's submitted api key
    const handleSubmit = async () => {
        if (errorCode == 10) {
            console.log("cookies are not enabled");

            return;
        }
        //if no api key is entered by the user, they are made aware and function is exited
        if (apiKey == undefined || apiKey.length == 0) {
            setErrorCode(1);
            return;
        }

        

        //if user does enter a value, we check if it returns tournaments from the api call
        //either the api key is invalid, or the user is not an admin of any tournaments, this
        //is handled in the apiDataToTournaments function
        if (apiKey != undefined) {
            if (auth.currentUser == null) {
                console.log("not signed in");
                setErrorCode(4);
                return;
            }
            writeToFirebase("apiKeys/" + auth.currentUser!.uid, apiKey);
            await APICall(apiKey).then(async (value) => {
                //if it doesnt return a tournament, either api key is invalid or they are not an admin of any tournaments
                //so we return
                if (value.data == undefined) {
                    setErrorCode(2);
                    return;
                }
                //if the key is valid but the length is 0, then the user is not an admin of any tournaments
                if (value.data.currentUser.tournaments.nodes.length == 0) {
                    setErrorCode(3);
                    return;
                }
                //tournaments are stored in the value variable, if it is not empty then it means there are
                //tournaments and we can proceed
                else {
                    keyIsGood = true;
                }
                //we make the api call with the user's provided api key
                setTournaments(apiDataToTournaments(value)!);


            });

            //only goes to the next page if the key is valid
            if (keyIsGood) {
                setPage(page + 1);
            }
            //return if it's not valid
            else return;
        }
    };
    return (
        <div className={stepStyles.formsignin}>
            <form>
                <div className="form-floating textfieldtext">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Enter your API key here"
                        value={apiKey}
                        onKeyDown={(e) => handleKeyPress(e)}
                        onChange={(e) => setApiKey(e.target.value)}
                    ></input>
                    <label> Enter your API Key here </label>
                </div>
            </form>
        </div>
    )


}
//function for api call
async function APICall(apiKey: string) {
    //API call
    return axios
        .get("api/getAdminTournaments", { params: { apiKey: apiKey } })
        .then(({ data }) => {
            return data;
        });
}
