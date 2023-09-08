import { Carpool, Player } from "../../../../definitions/seedingTypes";

export default interface carpoolProps {
    page: number;
    setPage: (page: number) => void;
    playerList: Player[];
    setShowCarpoolPage: (showCarpoolPage: boolean) => void;
    setCarpoolList: (carpools: Carpool[]) => void;
    carpoolList: Carpool[];
    handleSubmit:()=>void;
    isNextPageLoading:boolean;
  }