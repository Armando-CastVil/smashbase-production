
import stepStyles from "../../../../styles/ApiKeyStep.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../globalComponents/modules/firebase";
import { useEffect } from "react";
import fillInApiKey from "../modules/fillInApiKey";
import ErrorCode from "../modules/enums";
import { Tournament } from "../../../definitions/seedingTypes";

interface props {
    errorCode: number
    setErrorCode: (errorCode: number) => void
    apiKey: string | undefined;
    setApiKey: (ApiKey: string | undefined) => void;
    setTournaments: (tournaments: Tournament[]) => void;
    page: number;
    setPage: (page: number) => void;
    handleSubmit: () => void;
}

export default function ApiKeyForm({ errorCode, setErrorCode, apiKey, setApiKey, setTournaments, page, setPage, handleSubmit }: props) {

    //this piece of code fills in the user's api key
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setErrorCode(ErrorCode.None)
            try {
                if (user) {

                    const fetchedApiKey = await fillInApiKey(user, apiKey);
                    if (fetchedApiKey !== undefined) {
                        setApiKey(fetchedApiKey);
                    }
                } else {
                    setErrorCode(ErrorCode.SignInRequired)
                    return
                }
            } catch (error) {
                if (error instanceof Error && error.message == ErrorCode.NotWhitelisted + "") setErrorCode(ErrorCode.NotWhitelisted)
                else setErrorCode(ErrorCode.UnKnownError)

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

