import { Carpool, Player } from "../../../definitions/seedingTypes";

export interface separationStepProps {
    page: number;
    setPage: (page: number) => void;
    apiKey: string | undefined;
    preavoidancePlayerList: Player[];
    finalPlayerList: Player[];
    setFinalPlayerList: (players: Player[]) => void;
    projectedPaths: Promise<number[][]> | undefined;
    slug: string | undefined;
    numTopStaticSeeds:number;
    setNumTopStaticSeeds:(numTopStaticSeeds:number)=>void
    conservativity:string;
    setConservativity:(conservativity:string)=>void
    location:string;
    setLocation:(location:string)=>void
    historation:string;
    setHistoration:(historation:string)=>void
    carpoolList:Carpool[];
    setCarpoolList:(carpoolList:Carpool[])=>void
    setNumOfRegionalConflicts:(num:number)=>void
    setNumOfRematchConflicts:(num:number)=>void
  }