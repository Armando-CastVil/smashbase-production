import { Player } from "../../../definitions/seedingTypes";

export interface separationStepProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    preavoidancePlayerList: Player[];
    setFinalPlayerList: (players: Player[]) => void;
    slug: string | undefined;
  }