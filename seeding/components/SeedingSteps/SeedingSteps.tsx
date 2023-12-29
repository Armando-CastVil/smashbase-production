import { useState } from "react";
import { SeedingIntro, ApiKeyStep, TournamentDisplayStep, EventDisplayStep, PlayerListDisplayStep, SeparationStep, FinalStep, SeedingOutro } from "./modules/index";
import { Carpool, Player, Tournament, TourneyEvent } from "../../definitions/seedingTypes";
import MajorPrompt from "../MajorPrompt/MajorPrompt";
import SeedingPass from "../SeedingPass/SeedingPass";
// import { perf } from "../../../globalComponents/modules/firebase";

export default function SeedingSteps() {
  const [page, setPage] = useState<number>(0);
  const [apiKey, setApiKey] = useState<string | undefined>("");
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [events, setEvents] = useState<TourneyEvent[]>([])
  const [initialPlayerList, setInitialPlayerList] = useState<Player[]>([])
  const [preavoidancePlayerList, setPreavoidancePlayerList] = useState<Player[]>([])
  const [finalPlayerList, setFinalPlayerList] = useState<Player[]>([])
  const [eventSlug, setEventSlug] = useState<string | undefined>("")
  const [startTime, setStartTime] = useState<number | undefined>()
  const [endTime, setEndTime] = useState<number | undefined>()
  const [projectedPaths, setProjectedPaths] = useState<Promise<number[][]> | undefined>(undefined)
  const [R1PhaseID, setR1PhaseID] = useState<number | undefined>(undefined)
  const [numTopStaticSeeds, setNumTopStaticSeeds] = useState<number>(1);
  const [conservativity, setConservativity] = useState<string>("moderate");
  const [location, setLocation] = useState<string>("moderate");
  const [historation, setHistoration] = useState<string>("moderate");
  const [carpoolList, setCarpoolList] = useState<Carpool[]>([]);
  const [numOfRegionalConflicts, setNumOfRegionalConflicts] = useState<number>(0);
  const [numOfRematchConflicts, setNumOfRematchConflicts] = useState<number>(0);

  function melee() {
    for(let i = 0; i<events.length; i++) {
      if(events[i].slug == eventSlug) return events[i].videogameId == 1
    }
    return false;
  }


  const currentPageComponent = (
    page === 0 ? (
      <SeedingPass />
    ) :page === 1? (
      <TournamentDisplayStep page={page} setPage={setPage} apiKey={apiKey} tournaments={tournaments} setEvents={setEvents} />
    ) : page === 2 ? (
      <EventDisplayStep page={page} setPage={setPage} apiKey={apiKey} events={events} setInitialPlayerList={setInitialPlayerList} setPreavoidancePlayerList={setPreavoidancePlayerList} setEventSlug={setEventSlug} slug={eventSlug} setProjectedPaths={setProjectedPaths} setR1PhaseID={setR1PhaseID} setFinalPlayerList={setFinalPlayerList} />
    ) : page === 3 ? (
      <PlayerListDisplayStep page={page} setPage={setPage} slug={eventSlug} preavoidancePlayerList={preavoidancePlayerList} setPreavoidancePlayerList={setPreavoidancePlayerList} finalPlayerList={finalPlayerList} setFinalPlayerList={setFinalPlayerList} melee={melee()}/>
    ) : page == 4 ? (
      <SeparationStep
        slug={eventSlug} page={page} setPage={setPage} apiKey={apiKey} preavoidancePlayerList={preavoidancePlayerList}
        finalPlayerList={finalPlayerList} setFinalPlayerList={setFinalPlayerList} projectedPaths={projectedPaths} numTopStaticSeeds={numTopStaticSeeds} 
        setNumTopStaticSeeds={setNumTopStaticSeeds} conservativity={conservativity} setConservativity={setConservativity} 
        location={location} setLocation={setLocation} historation={historation} setHistoration={setHistoration} carpoolList={carpoolList} setCarpoolList={setCarpoolList} 
        setNumOfRegionalConflicts={setNumOfRegionalConflicts} setNumOfRematchConflicts={setNumOfRematchConflicts}/>
    ) : page == 5 ?
      <FinalStep slug={eventSlug} page={page} setPage={setPage} apiKey={apiKey} initialPlayerList={initialPlayerList} 
      finalPlayerList={finalPlayerList} setFinalPlayerList={setFinalPlayerList} setEndTime={setEndTime} R1PhaseID={R1PhaseID} 
      numOfRegionalConflicts={numOfRegionalConflicts} numOfRematchConflicts={numOfRematchConflicts} carpoolList={carpoolList}
      melee={melee()}/>
      : page == 6 ?
        <SeedingOutro slug={eventSlug} startTime={startTime} endTime={endTime} finalPlayerList={finalPlayerList} />
        : <div></div>
  )
  return (
    <div>{currentPageComponent}</div>
  )
}
