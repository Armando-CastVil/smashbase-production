
import stepStyles from "../../../../styles/ApiKeyStep.module.css";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../utility/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Tournament from "../../../classes/Tournament";
import { useEffect } from "react";
import fillInApiKey from "../modules/fillInApiKey";
import ErrorCode from "../modules/enums";

interface props {
    errorCode: number
    setErrorCode: (errorCode: number) => void
    apiKey: string | undefined;
    setApiKey: (ApiKey: string|undefined) => void;
    setTournaments: (tournaments: Tournament[]) => void;
    page: number;
    setPage: (page: number) => void;
    handleSubmit: () => void;
}

//Initialize Firebase configuration
export const ApiApp = initializeApp(firebaseConfig);
const auth = getAuth();

export default function ApiKeyForm({ errorCode, setErrorCode, apiKey, setApiKey, setTournaments, page, setPage, handleSubmit }: props) {

    //this piece of code fills in the user's api key
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setErrorCode(ErrorCode.None)
            try {
                if (user) {
                    console.log("User is authenticated:", user);
                    const fetchedApiKey = await fillInApiKey(user, apiKey);
                    console.log("Fetched api key is:", fetchedApiKey);
                    if (fetchedApiKey !== undefined) {
                        setApiKey(fetchedApiKey);
                    }
                } else {
                    setErrorCode(ErrorCode.SignInRequired)
                    console.log("User is not authenticated.");
                    return
                }
            } catch (error) {
                if(error == ErrorCode.NotWhitelisted) setErrorCode(ErrorCode.NotWhitelisted)
                else setErrorCode(ErrorCode.UnKnownError)
                console.error("Error filling in API key:", error);
            }
        });
    
        
        return () => {
            unsubscribe();
        };
    }, []);
    

    function handleKeyPress(event: { key: string; preventDefault: () => void }) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            handleSubmit();
        }
    }


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

