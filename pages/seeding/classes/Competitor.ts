import { Carpool } from "../types/seedingTypes";

export default class Competitor
{
    smashggID: string;
    bracketID:number;
    entrantID:number;
    tag: string;
    rating: number;
    seed:number;
    region:string|undefined;
    carpool:Carpool|undefined;
    isWinner: boolean;
    projectedPath:Competitor[]=[];

    

    constructor(smashggID:string,bracketID:number,tag:string,rating:number,seed:number,region:string|undefined,carpool:Carpool|undefined,isWinner:boolean,entrantID:number) {
      this.smashggID=smashggID;
      this.bracketID=bracketID;
      this.tag=tag;
      this.rating=rating;
      this.seed=seed;
      this.region=region;
      this.carpool=carpool
      this.isWinner=isWinner
      this.entrantID=entrantID;
    }
    setRating(newRating:number)
    {
      this.rating=newRating
    }
    setBracketID(newBracketID:number)
    {
      this.bracketID=newBracketID
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