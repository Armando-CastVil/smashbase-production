import Competitor from "../classes/Competitor";

export declare type Participant = {
    smashggID: string|undefined;
    tag: string;
    rating: number;
    projectedPath:number[];
    seed:number;
    region:string|undefined;
    carpool:number|string|undefined;
    bracketID:number;
    isWinner: boolean;
};

export declare type Carpool = {
    carpoolName: string|number|undefined;
    carpoolMembers:Competitor[]

};

export declare type Match = {
    id: number | string;
    name?: string;
    nextWinnersMatchId: string | null;
    nextLosersMatchId: string|undefined;
    winner:Competitor|undefined;
    loser:Competitor|undefined;
    competitors: Competitor[];
    bracketSide:string;
};