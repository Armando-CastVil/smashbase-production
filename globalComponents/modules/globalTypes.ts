// Define the Player type
export declare type User = {
    startGGID: number;
    userName: string;
    rating: number|undefined;
    apiKey:string;
    profilePicture:string  | undefined;
    pfpHeight:number | undefined;
    pfpWidth:number | undefined;
};


export declare type Profile=
{
    startGGID: number;
    profilePicture:string  | undefined;
    profileName: string;
    rating: number|undefined;
    country:string|undefined;
    main:string|undefined;
    worldRank:number|undefined;
    regionRank:number|undefined;
    characterRank:number|undefined;
    

}