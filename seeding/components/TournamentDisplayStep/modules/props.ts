import { Tournament, TourneyEvent } from "../../../definitions/seedingTypes";

interface tournamentDisplayProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    tournaments: Tournament[];
    setEvents: (events: TourneyEvent[]) => void;
  }
  export type {tournamentDisplayProps}