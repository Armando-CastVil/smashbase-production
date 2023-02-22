export default class TourneyEvent
{
    name:string|undefined;
    id:number|undefined;
    slug:string|undefined
    numEntrants:number|undefined
    constructor(name:string,id:number,slug:string,numEntrants:number) {
      this.name=name;
      this.id=id;
      this.slug=slug;
      this.numEntrants=numEntrants;
      
      
    }

  }