import { Player } from "../../../definitions/seedingTypes";
import { phaseGroupDataInterface } from "./phaseGroupDataInterface";


export interface playerListDisplayProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    playerList: Player[];
    setPreAvoidancePlayerList: (players: Player[]) => void;
    slug: string | undefined;
}
