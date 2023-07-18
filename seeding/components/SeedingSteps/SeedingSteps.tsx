
//all the steps are imported from index.ts at once to avoid multiple import statements
import Props, * as seedingStepImports from "./modules/index"
import Tournament from "../../classes/Tournament";
import TourneyEvent from "../../classes/TourneyEvent";
import Competitor from "../../classes/Competitor";
import { useState } from "react";
import { PhaseGroupDataInterface } from "./modules/seedingInterfaces";

export default function SeedingSteps({page,setPage}:Props)
{
    const [apiKey, setApiKey] = useState<string>("");
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [events, setEvents] = useState<TourneyEvent[]>([])
    const [initialPlayerList, setInitialPlayerList] = useState<Competitor[]>([])
    const [preAvoidancePlayerList, setPreAvoidancePlayerList] = useState<Competitor[]>([])
    const [finalPlayerList, setFinalPlayerList] = useState<Competitor[]>([])
    const [eventSlug, setEventSlug] = useState<string | undefined>("")
    const [phaseGroups, setPhaseGroups] = useState<number[] | undefined>([])
    const [startTime, setStartTime] = useState<number | undefined>()
    const [endTime, setEndTime] = useState<number | undefined>()
      //this state will hold the processed data obtained from the api call
    //it's a hashmap with every value corresponding to an array of bracket IDs ordered by seed
    const [phaseGroupData, setPhaseGroupData] = useState<PhaseGroupDataInterface>()


    // Extract the components from the seedingComponents object using their names
    const {SeedingIntro,ApiKeyStep,TournamentDisplayStep,EventDisplayStep,PlayerListDisplayStep,SeparationStep,
            FinalStep,SeedingOutro } = seedingStepImports;
    


       const componentList = [
        <SeedingIntro
            key="SeedingIntro"
            page={page}
            setPage={setPage}
            setStartTime={setStartTime}
        />,
        <ApiKeyStep
            key="ApiKeyStep"
            page={page}
            setPage={setPage}
            apiKey={apiKey}
            setApiKey={setApiKey}
            setTournaments={setTournaments}
        />,
        <TournamentDisplayStep
            key="TournamentDisplayStep"
            page={page}
            setPage={setPage}
            apiKey={apiKey}
            tournaments={tournaments}
            setEvents={setEvents}
        />,
        <EventDisplayStep
            key="EventDisplayStep"
            page={page}
            setPage={setPage}
            apiKey={apiKey}
            events={events}
            setPlayerList={setPlayerList}
            slug={eventSlug}
            setEventSlug={setEventSlug}
            setPhaseGroups={setPhaseGroups}
        />,
        <PlayerListDisplayStep
            key="PlayerListDisplayStep"
            page={page}
            setPage={setPage}
            apiKey={apiKey}
            playerList={playerList}
            setPlayerList={setPlayerList}
            slug={eventSlug}
            phaseGroups={phaseGroups}
            setPhaseGroupData={setPhaseGroupData}
        />
        ,
        <SeparationStep
            key="SeparationStep"
            page={page}
            setPage={setPage}
            apiKey={apiKey}
            playerList={playerList}
            setPlayerList={setPlayerList}
            phaseGroupData={phaseGroupData}
            slug={eventSlug}
        />,
        <FinalStep
            key="FinalStep"
            page={page}
            setPage={setPage}
            apiKey={apiKey}
            playerList={playerList}
            setPlayerList={setPlayerList}
            slug={eventSlug}
            phaseGroups={phaseGroups}
            phaseGroupData={phaseGroupData!}
            setEndTime={setEndTime}
        />,
        <SeedingOutro
            slug={eventSlug}
            startTime={startTime}
            endTime={endTime}
            playerList={playerList}
            key="SeedingOutro"
        />


    ];
    return(
        <div></div>
    )
}
