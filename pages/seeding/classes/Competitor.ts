import { Carpool } from "../types/seedingTypes";

export default class Competitor
{
    smashggID: string;
    bracketIDs:number[];
    tag: string;
    rating: number;
    seed:number;
    region:string|undefined;
    carpool:Carpool|undefined;
    isWinner: boolean;
    projectedPath:Competitor[]=[];

    

    constructor(smashggID:string,bracketIDs:number[],tag:string,rating:number,seed:number,region:string|undefined,carpool:Carpool|undefined,isWinner:boolean) {
      this.smashggID=smashggID;
      this.tag=tag;
      this.rating=rating;
      this.seed=seed;
      this.region=region;
      this.carpool=carpool
      this.isWinner=isWinner
      this.bracketIDs=[]
    }
    setRating(newRating:number)
    {
      this.rating=newRating
    }
  
    setSeed(seed:number)
    {
      this.seed=seed
    }
    addPlayerToPath(player:Competitor)
    {
      this.projectedPath.push(player)
    }

    


  }