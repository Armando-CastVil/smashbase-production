import { Player } from "../../../definitions/seedingTypes";
import { phaseGroupDataInterface } from "./phaseGroupDataInterface";


export interface playerListDisplayProps {
    page: number;
    setPage: (page: number) => void;
    preavoidancePlayerList:Player[];
    setPreavoidancePlayerList: (players: Player[]) => void;
    slug: string | undefined;
}
