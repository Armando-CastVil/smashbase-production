import { Player } from "../../../definitions/seedingTypes";


export interface playerListDisplayProps {
    page: number;
    setPage: (page: number) => void;
    preavoidancePlayerList:Player[];
    setPreavoidancePlayerList: (players: Player[]) => void;
    slug: string | undefined;
}
