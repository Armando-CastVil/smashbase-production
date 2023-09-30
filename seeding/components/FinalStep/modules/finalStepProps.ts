import { Carpool, Player } from "../../../definitions/seedingTypes";

export interface finalStepProps
{
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    initialPlayerList:Player[];
    finalPlayerList: Player[];
    setFinalPlayerList: (competitors: Player[]) => void;
    slug: string | undefined;
    setEndTime: (startTime: number) => void;
    R1PhaseID: number | undefined;
    numOfRegionalConflicts: number;
    numOfRematchConflicts: number;
    carpoolList:Carpool[]
    melee: boolean;
}