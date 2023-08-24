
import Props, * as seedingStepImports from "./modules/index"
import { useState } from "react";
import {SeedingIntro, ApiKeyStep, TournamentDisplayStep, EventDisplayStep, PlayerListDisplayStep, SeparationStep, FinalStep, SeedingOutro } from "./modules/index";
import { Player, Tournament, TourneyEvent } from "../../definitions/seedingTypes";

export default function SeedingSteps({ page, setPage }: Props) {
    const [apiKey, setApiKey] = useState<string|undefined>("");
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [events, setEvents] = useState<TourneyEvent[]>([])
    const [initialPlayerList, setInitialPlayerList] = useState<Player[]>([])
    const [preAvoidancePlayerList, setPreAvoidancePlayerList] = useState<Player[]>([])
    const [finalPlayerList, setFinalPlayerList] = useState<Player[]>([])
    const [eventSlug, setEventSlug] = useState<string | undefined>("")
    const [phaseGroups, setPhaseGroups] = useState<number[] | undefined>([])
    const [startTime, setStartTime] = useState<number | undefined>()
    const [endTime, setEndTime] = useState<number | undefined>()
    const [projectedPaths, setProjectedPaths] = useState<number[][] | undefined>(undefined)

    const currentPageComponent = (
        page === 0 ? (
          <SeedingIntro page={page} setPage={setPage} setStartTime={setStartTime} />
        ) : page === 1 ? (
          <ApiKeyStep page={page} setPage={setPage} apiKey={apiKey} setApiKey={setApiKey}  setTournaments={setTournaments} />
        ) : page === 2 ? (
          <TournamentDisplayStep page={page} setPage={setPage} apiKey={apiKey} tournaments={tournaments} setEvents={setEvents} />
        ) : page === 3 ? (
          <EventDisplayStep page={page} setPage={setPage} apiKey={apiKey}  events={events} setInitialPlayerList={setInitialPlayerList} setEventSlug={setEventSlug} slug={eventSlug} setPhaseGroups={setPhaseGroups} />
        ) : page === 4 ? (
          <PlayerListDisplayStep page={page} setPage={setPage} apiKey={apiKey} slug={eventSlug} playerList={initialPlayerList} setPreAvoidancePlayerList={setPreAvoidancePlayerList}   />
        ) : page === 5 ? (
          <SeparationStep page={page} setPage={setPage} apiKey={apiKey} slug={eventSlug} playerList={preAvoidancePlayerList} setFinalPlayerList={setFinalPlayerList}   />
        ) : page === 6 ? (
          <FinalStep page={page} setPage={setPage} apiKey={apiKey} playerList={finalPlayerList} setFinalPlayerList={setFinalPlayerList} slug={eventSlug} phaseGroups={phaseGroups} setEndTime={setEndTime}  />
        ) : page===7?
        <SeedingOutro slug={eventSlug} startTime={startTime} endTime={endTime} playerList={finalPlayerList}/>
        :<div></div>
      )
    return (
        <div>{currentPageComponent}</div>
    )
}
