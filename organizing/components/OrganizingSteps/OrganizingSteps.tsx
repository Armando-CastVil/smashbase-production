import { useState } from "react";
import { Player, Tournament, TourneyEvent } from "../../../seeding/definitions/seedingTypes";
import ApiKeyStep from "../../../seeding/components/ApiKeyStep/ApiKeyStep";
import { EventDisplayStep, TournamentDisplayStep } from "../../../seeding/components/SeedingSteps/modules";
import EventSelectStep from "../EventSelectStep/EventSelectStep";
import RunningStep from "../RunningStep/RunningStep";
import { Station } from "../../definitions/organizingTypes";


export default function OrganizingSteps() {
    const [page, setPage] = useState<number>(0);
    const [apiKey, setApiKey] = useState<string | undefined>("");
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [events, setEvents] = useState<TourneyEvent[]>([])
    const [initialPlayerList, setInitialPlayerList] = useState<Player[]>([])
    const [eventSlug, setEventSlug] = useState<string | undefined>("")
    // State to store generated stations
    const [stations, setStations] = useState<Station[]>([]);


    const currentPageComponent = (
        page === 0 ? (
            <ApiKeyStep page={page} setPage={setPage} apiKey={apiKey} setApiKey={setApiKey} setTournaments={setTournaments} />
        ) : page === 1 ? (
            <TournamentDisplayStep page={page} setPage={setPage} apiKey={apiKey} tournaments={tournaments} setEvents={setEvents} />
        ) : page === 2 ? (
            <EventSelectStep page={page} setPage={setPage} apiKey={apiKey} events={events} setInitialPlayerList={setInitialPlayerList}  setEventSlug={setEventSlug} slug={eventSlug} stations={stations} setStations={setStations} />
        ) : page === 3 ? (
            <RunningStep playerList={initialPlayerList} stations={stations} />
        ) : <div></div>
    )
    return (
     
        <div>{currentPageComponent}</div>
        
    )
}
