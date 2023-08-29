import { Carpool, Player } from "../../../../definitions/seedingTypes";

export default interface carpoolProps {
    page: number;
    setPage: (page: number) => void;
    playerList: Player[];
    setFinalPlayerList: (players: Player[]) => void;
    setShowCarpoolPage: (showCarpoolPage: boolean) => void;
    setCarpoolList: (carpools: Carpool[]) => void;
    carpoolList: Carpool[];
  }