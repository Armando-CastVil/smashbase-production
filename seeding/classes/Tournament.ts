

export default class Tournament
{
    name:string|undefined;
    city:string|undefined;
    url:string|undefined;
    slug:string|undefined;
    startAt:number|undefined;
    imageURL:string|undefined

    

    constructor(name:string,city:string,url:string,slug:string,startAt:number,imageURL:string) {
      this.name=name;
      this.city=city;
      this.url=url;
      this.slug=slug;
      this.startAt=startAt;
      this.imageURL=imageURL
      
    }
    
 

    


  }