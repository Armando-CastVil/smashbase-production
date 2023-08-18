import axios from "axios"
import Competitor from "../../../classes/Competitor";
import startGGQueryer from "../../../../pages/api/queryStartGG";

export default async function getEntrantsFromSlug(slug:string,apiKey:string)
{
   
    var playerList:Competitor[]=[];
    var pages:number=1;
    
    //get number of pages
    let data= await getCompetitorsByPage(slug,apiKey,pages)
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
            let data= await getCompetitorsByPage(slug,apiKey,i)
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

//some events have too many competitors, so you can't get them all from a single call
//the excess players get put on another page, which gets passed as a variable
async function getCompetitorsByPage(slug:string,apiKey:string,page:number)
{
    const query= `query EventEntrants($eventSlug: String,$perPage:Int!,$page:Int!) 
    {
      event(slug:$eventSlug) 
      {
        entrants(query: 
          {
            page:$page
            perPage: $perPage
          }) 
          {
            pageInfo 
            {
              total
              totalPages
            }
            nodes 
            {
              participants 
              {
                gamerTag
                player
                {
                  id
                }
              }
            }
          }
      }
    }`
    const  variables= {
        "eventSlug":slug,
        "perPage":420,
        "page":page
      }
    const data = await startGGQueryer.queryStartGG(apiKey, query, variables);
    return data
}
