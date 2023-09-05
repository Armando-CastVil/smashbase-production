import { Player } from "../../../definitions/seedingTypes";

export interface finalStepProps
{
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    finalPlayerList: Player[];
    setFinalPlayerList: (competitors: Player[]) => void;
    slug: string | undefined;
    phaseGroups: number[] | undefined;
    setEndTime: (startTime: number) => void;
    R1PhaseID: number | undefined;
}