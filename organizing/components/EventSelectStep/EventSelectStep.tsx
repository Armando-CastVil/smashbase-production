import globalStyles from "/styles/GlobalSeedingStyles.module.css";
import stepStyles from "/styles/EventSelectStep.module.css";
import { useEffect, useState } from "react";
import InlineMessage from "@atlaskit/inline-message";
import * as imports from "../../../seeding/components/EventDisplayStep/modules/EventDisplayStepIndex"
import getPhaseAndPhaseGroupIDs from "../../../seeding/components/EventDisplayStep/modules/getPhaseAndPhaseGroupIDs";
import getSeedData from "../../../seeding/components/EventDisplayStep/modules/getSeedData";
import setSeedIDs from "../../../seeding/components/EventDisplayStep/modules/setSeedIDs";
import OrganizingFooter from "../OrganizingFooter";
import LoadingScreen from "../../../seeding/components/LoadingScreen";
import { Player, TourneyEvent } from "../../../seeding/definitions/seedingTypes";
import getEntries from "./modules/getEntries";
import { Station } from "../../definitions/organizingTypes";
import { useRouter } from "next/router";


interface eventSelectStepProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    events: TourneyEvent[];
    setInitialPlayerList: (events: any) => void;
    slug: string | undefined;
    setEventSlug: (slug: string) => void;
    stations: Station[]
    setStations: (stations: Station[]) => void;
}
export default function EventSelectStep({ page, setPage, apiKey, events, setInitialPlayerList, setEventSlug, slug, stations, setStations }: eventSelectStepProps) {

    //this state will manage which events have been selected
    const [checkBoxes, setCheckBoxes] = useState<any[]>(imports.CreateCheckboxes(events, -1));
    const [isBoxSelected, setIsBoxSelected] = useState<boolean>();
    const [areThereEnoughEntrants, setAreThereEnoughEntrants] = useState<boolean>(true)
    const [areStationsSelected, setAreStationsSelected] = useState<boolean>();
    const [eventID, setEventID] = useState<string | undefined>();


    // Inside your EventSelectStep component, when the user selects an event:
    const router = useRouter();

    const handleEventSelection = (eventID: string, players: Player[], stations: Station[]) => {
        // Construct the URL for the event details page
        const eventDetailsURL = `/${eventID}`;


        router.push({
            pathname: eventDetailsURL,
            query: {
                players: JSON.stringify({ players }),
                stations: JSON.stringify({ stations }),
                eventID: eventID,
            }
        }, eventDetailsURL);
    };


    // Function to generate stations based on the selected number
    const generateStations = (numberOfStations: number) => {
        const newStations: Station[] = [];
        for (let i = 1; i <= numberOfStations; i++) {
            const station: Station = {
                id: i,
                startAt: undefined,
                players: [],
                isCompleted: false,
                isAvailable: true,
            };
            newStations.push(station);
        }
        setStations(newStations);
    };


    //this variable exists because setting the slug as a state takes too long 
    //so we temporarily store it here
    let instantSlug: string = "";

    //handle submit function after next button is pressed
    const handleSubmit = async () => {

        setAreThereEnoughEntrants(true)
     
        //index of selected event
        //index of selected tournament
        let eventIndex: number = imports.selectedBoxIndex(checkBoxes)
        setIsBoxSelected(eventIndex != -1);

        //if no box has been checked, exit submit function
        if (eventIndex == -1) {
            setIsBoxSelected(false)
            return
        }
        //if no stations have been checked, exit submit function
        if (stations.length === 0) {
            setAreStationsSelected(false)
            return
        }

        //if a checked box was found, go through the submission motions
        instantSlug = events[eventIndex].slug!;
        let instantEventID = events[eventIndex].id!
        setEventID(instantEventID.toString())
        setEventSlug(instantSlug)

        //this array will hold the array of competitors that will be passed to the next step
        let playerList: Player[] = await getEntries(
            events[eventIndex].slug!,
            apiKey!
        );
        handleEventSelection(instantEventID.toString(), playerList, stations)




        // info for get projected paths
        let [phaseIDs, phaseGroupIDs]: [number[], number[]] = await getPhaseAndPhaseGroupIDs(apiKey!, instantSlug);
        let seedData = await getSeedData(apiKey!, phaseIDs)
        if (notEnoughPlayersError(seedData, playerList.length)) {
            // Set loading to false in case of an error
            setAreThereEnoughEntrants(false);
            
        } else {
            // Submission successful, set loading to false
            
            setSeedIDs(seedData, playerList)
        }
    }//end of handle submit function

    return (

        <div className={globalStyles.content}>
            <div>
                <LoadingScreen message="Fetching player data. The process might take a few seconds up to a couple minutes depending on the number of entrants." isVisible={false} />
            </div>
            <div className={stepStyles.tableContainer}>
                <div className={globalStyles.heading}>
                    <p>Select the target event</p>
                </div>
                <div className={globalStyles.tableComponent}>
                    <imports.CreateEventTable events={events} checkBoxes={checkBoxes} setCheckBoxes={setCheckBoxes} />
                </div>
                <div className={globalStyles.errorMessages}>
                    {isBoxSelected == false ? (
                        <InlineMessage appearance="error" iconLabel="Error! No tournament has been selected." secondaryText="Please select an event." />
                    ) :
                        areThereEnoughEntrants ?
                            (<p></p>)
                            : <InlineMessage appearance="error" iconLabel="Progressions Error: One of the bracket phases has more expected entrants than players entered in the event" secondaryText="Progressions Error: One of the bracket phases has more expected entrants than players entered in the event" />
                    }
                    {areStationsSelected == false ? (
                        <InlineMessage appearance="error" iconLabel="Error! Please select how many stations you have." secondaryText="Error! Please select how many stations you have." />
                    ) :
                        areThereEnoughEntrants ?
                            (<p></p>)
                            : <InlineMessage appearance="error" iconLabel="Progressions Error: One of the bracket phases has more expected entrants than players entered in the event" secondaryText="Progressions Error: One of the bracket phases has more expected entrants than players entered in the event" />
                    }
                </div>
            </div>
            <div className={stepStyles.centerContainer}>
                <div className={stepStyles.staticSeedsForm}>
                    <span className={stepStyles.whiteText}
                    ><p>Select the number of available stations</p></span>
                    <input
                        className={stepStyles.staticSeedsFormInput}
                        type="number"
                        id="selectedPlayers"
                        min="1"
                        value={stations.length}
                        onChange={(e) =>
                            generateStations(parseInt(e.target.value))
                        }
                    />
                    <div className={stepStyles.infoContainer}>
                        <div className={stepStyles.infoText}>
                            <InlineMessage appearance="info">
                                <p className={stepStyles.infoText}>
                                    This sets the number of available stations the tournament has
                                </p>
                            </InlineMessage>
                        </div>
                    </div>
                </div>

            </div>


            <div className={globalStyles.seedingFooterContainer}>
                <OrganizingFooter
                    page={page}
                    setPage={setPage}
                    handleSubmit={handleSubmit}
                    isDisabled={events.length === 0 || !areThereEnoughEntrants}
                ></OrganizingFooter>
            </div>
        </div>

    );
};

function notEnoughPlayersError(seedData: any, numPlayers: number): boolean {
    for (let i = 0; i < seedData.length; i++) {
        if (seedData[i].seedNum > numPlayers) return true;
    }
    return false;
}