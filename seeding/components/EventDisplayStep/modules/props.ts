import { TourneyEvent } from "../../../definitions/seedingTypes";


interface eventDisplayStepProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    events: TourneyEvent[];
    setInitialPlayerList: (events: any) => void;
    setPreavoidancePlayerList: (events: any) => void;
    slug: string | undefined;
    setEventSlug: (slug: string) => void;
    setProjectedPaths: (projectedPaths: Promise<number[][]>) => void;
    setR1PhaseID: (phaseID: number) => void;
  }
export type {eventDisplayStepProps}