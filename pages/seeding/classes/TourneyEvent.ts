export default class TourneyEvent
{
    name:string|undefined;
    id:number|undefined;
    slug:string|undefined
    constructor(name:string,id:number,slug:string) {
      this.name=name;
      this.id=id;
      this.slug=slug
      
      
    }

  }