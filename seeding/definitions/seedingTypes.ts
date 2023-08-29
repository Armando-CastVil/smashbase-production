


export declare type Tournament = {
    name: string | undefined;
    city: string | undefined;
    url: string | undefined;
    slug: string | undefined;
    startAt: number | undefined;
    imageURL: string | undefined

}
export declare type TourneyEvent = {
    name: string | undefined;
    id: number | undefined;
    slug: string | undefined
    numEntrants: number | undefined
}
export declare type Carpool = {
    carpoolName: string | number | undefined;
    carpoolMembers: number[]

};

export declare type Match = {
    id: number | string;
    name?: string;
    nextWinnersMatchId: string | null;
    nextLosersMatchId: string | undefined;
    winner: Player | undefined;
    loser: Player | undefined;
    competitors:Player[];
    bracketSide: string | undefined;
};

// Define the Player type
export declare type Player = {
    playerID: number;
    tag: string;
    rating: number;
    carpool: Carpool|undefined;
    seedID: number;
    location: [number, number];
    setHistories: { [key: string]: number };
    seed:number|undefined;
};