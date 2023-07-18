import Competitor from "../classes/Competitor";



export declare type Carpool = {
    carpoolName: string|number|undefined;
    carpoolMembers:string[]

};

export declare type Match = {
    id: number | string;
    name?: string;
    nextWinnersMatchId: string | null;
    nextLosersMatchId: string|undefined;
    winner:Competitor|undefined;
    loser:Competitor|undefined;
    competitors: Competitor[];
    bracketSide:string|undefined;
};