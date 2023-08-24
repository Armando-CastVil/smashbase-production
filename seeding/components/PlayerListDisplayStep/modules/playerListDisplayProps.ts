import { Player } from "../../../definitions/seedingTypes";

interface phaseGroupDataInterface {
    phaseIDs: number[];
    phaseIDMap: Map<number, number[]>;
    seedIDMap: Map<number | string, number>;
    sets: any[];
  }
export interface playerListDisplayProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    playerList: Player[];
    setPreAvoidancePlayerList: (players: Player[]) => void;
    slug: string | undefined;
    phaseGroups: number[] | undefined;
    setPhaseGroupData: (phaseGroupData: phaseGroupDataInterface) => void;
}
