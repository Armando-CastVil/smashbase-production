import axios from "axios"
import Competitor from "../classes/Competitor";

export default async function getEntrantsFromSlug(slug:string,apiKey:string)
{
   
    var playerList:Competitor[]=[];
    var pages:number=1;
    
    //get number of pages
    let data= await ApiWrapper(slug,apiKey,pages)
    pages=data.data.event.entrants.pageInfo.totalPages
    for(let j=0;j<data.data.event.entrants.nodes.length;j++)
    {
                
                let temporaryCompetitor:Competitor=new Competitor("",[],"",0,0,"",undefined,false,undefined);
                temporaryCompetitor.tag=data.data.event.entrants.nodes[j].participants[0].gamerTag;
                temporaryCompetitor.smashggID=data.data.event.entrants.nodes[j].participants[0].player.id
                playerList.push(temporaryCompetitor)
               
    }
        
    

    //for every page get the entrant info and store it in an array, return once all entries have been processed
    for(let i=2;i<=pages;i++)
    {
            let data= await ApiWrapper(slug,apiKey,i)
            for(let j=0;j<data.data.event.entrants.nodes.length;j++)
            {
                
                let temporaryCompetitor:Competitor=new Competitor("",[],"",0,0,"",undefined,false,undefined);
                temporaryCompetitor.tag=data.data.event.entrants.nodes[j].participants[0].gamerTag;
                temporaryCompetitor.smashggID=data.data.event.entrants.nodes[j].participants[0].player.id
                playerList.push(temporaryCompetitor)
               
            }
        
    }

    
    return playerList;

    

    
}
async function APICall(slug:string,apiKey:string,page:number)
{
    
    //API call
    const { data } = await axios.get('api/getEntrants', { params: { slug:slug,apiKey:apiKey,page:page } });
 
  
    return data;
}

async function ApiWrapper(slug:string,apiKey:string,page:number)
{
    let data:any;
    for(let i=0;i<10;i++)
    {
        await APICall(slug,apiKey,page).then(async (value)=>
        {
            
            data=value
        })
        if(data==undefined)
        {
            continue
        }
        if(data!=undefined)
        {
            break
        }
        
    }
    return data
}