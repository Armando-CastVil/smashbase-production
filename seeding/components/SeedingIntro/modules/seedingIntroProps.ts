import { Tournament } from "../../../definitions/seedingTypes";

export default interface SeedingIntroProps {
    page: number;
    setPage: (page: number) => void;
    setStartTime: (startTime: number) => void;
    apiKey:string|undefined;
    setApiKey: (apiKey: string|undefined) => void;
    setTournaments: (tournaments: Tournament[]) => void;
  }
