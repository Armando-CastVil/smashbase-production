import { Player } from "../../seeding/definitions/seedingTypes";

export declare type Station = {
    id:number
    startAt: number | undefined;
    players:Player[]
    isCompleted:boolean
    isAvailable:boolean
}
export declare type QueueMatch = {
    player1:Player,
    player2:Player
    
}

