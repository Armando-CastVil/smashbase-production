import Tournament from "../../../classes/Tournament";
import TourneyEvent from "../../../classes/TourneyEvent";
import TournamentDisplayStep from "../TournamentDisplayStep";

interface tournamentDisplayProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    tournaments: Tournament[];
    setEvents: (events: TourneyEvent[]) => void;
  }
  export type {tournamentDisplayProps}