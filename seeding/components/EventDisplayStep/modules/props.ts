import { TourneyEvent } from "../../../definitions/seedingTypes";


interface eventDisplayStepProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    events: TourneyEvent[];
    setInitialPlayerList: (events: any) => void;
    slug: string | undefined;
    setEventSlug: (slug: string) => void;
    setPhaseGroups: (phaseGroups: number[]) => void;
  }
export type {eventDisplayStepProps}