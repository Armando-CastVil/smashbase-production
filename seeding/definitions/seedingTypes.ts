


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
    online: boolean
    videogameId: number
}
export declare type Carpool = {
    carpoolName: string | number | undefined;
    carpoolMembers: number[]

};

// Define the Player type
export declare type Player = {
    playerID: number;
    tag: string;
    rating: number;
    carpool: Carpool|undefined;
    seedID: number|undefined;
    locations: location[];
    setHistories?: { [key: string]: number };
};
export type location = {
    lat: number,
    lng: number,
    weight: number
}

export type playerData = {
    playerID?: string;
    sets: {[key: string]:number},
    locations: location[]
    rating: number,
    country?:string|undefined;
    main?:string|undefined;
    rank?:number|undefined;
    regionRank?:number|undefined;
    characterRank?:number|undefined;
    
}