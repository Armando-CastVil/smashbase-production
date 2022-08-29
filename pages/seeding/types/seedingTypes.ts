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

export declare type carpool = {
    carpoolName: string|number;
    carpoolMembers:Participant[]

};