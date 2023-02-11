import Competitor from "../classes/Competitor";
import { Match } from "../types/seedingTypes";
import assignBracketIds from "./assignBracketIds";
import processRound from "./processRound";
import setProjectedPath from "./setProjectedPath";

//this is mister bye, he fills in for all the byes, what a legend. 
//however you cant enter a bracket more than once, so he just gets dqd everytime
var misterBye:Competitor=
{
    smashggID: "",
    bracketIDs: [],
    tag: "mister Bye",
    rating: 0,
    seed: 69420,
    region: undefined,
    carpool: undefined,
    isWinner: false,
    projectedPath: [],
    setRating: function (newRating: number): void {
        throw new Error("Function not implemented.");
    },
    setSeed: function (seed: number): void {
        throw new Error("Function not implemented.");
    },
    addPlayerToPath: function (player: Competitor): void {
        throw new Error("Function not implemented.");
    }
}
interface phaseGroupDataInterface
{

    phaseIDs:number[];
    phaseIDMap:Map<number, number[]>
    sets:any[]
}
  //temporary match object to serve as template
  let tempMatch:Match=
  {
      id: "",
      name:"",
      nextWinnersMatchId: null,
      nextLosersMatchId:"",
      winner: undefined,
      loser: undefined,
      competitors: [],
      bracketSide: ""
  };

export default async function setMatchProperties(phaseGroupData:phaseGroupDataInterface,playerList:Competitor[])
{
    console.log(phaseGroupData)
   
    let rounds=numLosersRounds(playerList.length)
    
    let matchArray:Match[]=[]

    //create array for matches
    let matchMap = new Map<string|number,number >();

    //create hash map for player list
    let playerMap = new Map<number, number>();


    let playerListWithbracketIDs:Competitor[]=assignBracketIds(phaseGroupData,playerList)

    
    //put key value pairs in player hash map
    for(let i=0;i<playerListWithbracketIDs.length;i++)
    {
        //assign seeds while we are at it, do this in its own function later
        playerListWithbracketIDs[i].seed=i+1;
        for(let j=0;j<phaseGroupData.phaseIDs.length;j++)
        {
            for(let k=0;k<playerListWithbracketIDs[i].bracketIDs.length;k++)
            {
                let key:string|number=playerListWithbracketIDs[i].bracketIDs[k]
                let value:number=i
                playerMap.set(key,value)
            }
         
        }
      
    }
    

     

     
    
    //fill the match array with the data we already know of
    let matchesWithBasic:Match[]=JSON.parse(JSON.stringify(await setBasicProperties(phaseGroupData,matchArray)));
    //put key value pairs in hashmap
    for(let i=0;i<matchesWithBasic.length;i++)
    {
       
        //make this id the key for the hash map
        let key:string|number=matchArray[i].id

        //make the match we just pushed to the match array as the value
        let value:number=i

        //push this in to the hash map
        matchMap.set(key,value)
    }
    let matchesWithInitial=JSON.parse(JSON.stringify(await setInitialCompetitors(phaseGroupData,matchesWithBasic,playerList,playerMap)));
    let matchesWithNextSets=JSON.parse(JSON.stringify(await setNextMatches(matchMap,matchesWithInitial,phaseGroupData)));
    let matchesWithByes=JSON.parse(JSON.stringify(await fillByes(phaseGroupData,matchesWithNextSets)));
    let matchesWithNoDoubleByes=JSON.parse(JSON.stringify(await clearDoubleByes(matchesWithByes)));
    let processedMatches=JSON.parse(JSON.stringify(await processBracket(matchesWithNoDoubleByes,matchMap)));
    let finalMatchArray=JSON.parse(JSON.stringify(await clearByes(processedMatches)));
    let finalPlayerList=setProjectedPath(finalMatchArray,playerList)
    
    return finalPlayerList

}

//fill in the match properties that only require copying values
async function setBasicProperties(phaseGroupData:phaseGroupDataInterface,matchArray:Match[])
{
  
    
    
    //go through every set object in phaseGroupData and make matches out of them
    for(let i=0;i<phaseGroupData.sets.length;i++)
    {
       
        
        //make deep copy of template
        matchArray[i]=JSON.parse(JSON.stringify(tempMatch))

        //assign id straight from the api object we processed in the processPhaseGroups function
        matchArray[i].id=phaseGroupData.sets[i].id

        //assign name straight from the api object we processed in the processPhaseGroups function
        matchArray[i].name=phaseGroupData.sets[i].identifier

        //assign it side of the bracket, winners or losers side of the bracket
        if(phaseGroupData.sets[i].round>0)
        {
            matchArray[i].bracketSide="winners"
        }
        else
        {
            matchArray[i].bracketSide="losers"
        }

        
    
    }

    
    
    return matchArray
}

//this function goes through the matches and assigns them next match
async function setNextMatches(matchMap:Map<string|number,number >,matchArray:Match[],phaseGroupData:phaseGroupDataInterface)
{
   
    for(let i=0;i<phaseGroupData.sets.length;i++)
    {
        //if(phaseGroupData.sets[i].slots[0].prereqType=='set' && phaseGroupData.sets[i].slots[1].prereqType=='set')
        //if a match is in winners, then the two sets leading up to it are also both in winners
        if(phaseGroupData.sets[i].round>0)
        {
            

            //process slot 0
            if(phaseGroupData.sets[i].slots[0].prereqType!=null)
            {
                if(matchMap.get(phaseGroupData.sets[i].slots[0].prereqId)!=null)
                {
                    matchArray[matchMap.get(phaseGroupData.sets[i].slots[0].prereqId)!].nextWinnersMatchId=phaseGroupData.sets[i].id;
                }
                
            }

            //process slot 1
            if(phaseGroupData.sets[i].slots[1].prereqType!=null)
            {
                if(matchMap.get(phaseGroupData.sets[i].slots[1].prereqId)!=null)
                {
                    matchArray[matchMap.get(phaseGroupData.sets[i].slots[1].prereqId)!].nextWinnersMatchId=phaseGroupData.sets[i].id;
                }

                
            }

           
           
        }

        //if a match is in losers,
        if(phaseGroupData.sets[i].round<0)
        {
            //process slot 0 and slot 1 independently

            //process slot 0
            if(phaseGroupData.sets[i].slots[0].prereqType!=null)
            {
                if(matchMap.get(phaseGroupData.sets[i].slots[0].prereqId)!=null)
                {
                    matchArray[matchMap.get(phaseGroupData.sets[i].slots[0].prereqId)!].nextLosersMatchId=phaseGroupData.sets[i].id;
                }
                
            }

            //process slot 1
            if(phaseGroupData.sets[i].slots[1].prereqType!=null)
            {
                
                if(matchMap.get(phaseGroupData.sets[i].slots[1].prereqId)!=null)
                {
                    matchArray[matchMap.get(phaseGroupData.sets[i].slots[1].prereqId)!].nextLosersMatchId=phaseGroupData.sets[i].id;
                }
            }
            
            
        }

        
    }
    
    return matchArray
}

async function setInitialCompetitors(phaseGroupData:phaseGroupDataInterface,matchArray:Match[],playerList:Competitor[],playerMap:Map<number,number>)
{
    
    for(let i=0;i<phaseGroupData.sets.length;i++)
    {
        if(phaseGroupData.sets[i].slots[0].prereqType=="seed")
        {
          

            matchArray[i].competitors.push(playerList[playerMap.get(parseInt(phaseGroupData.sets[i].slots[0].prereqId))!])
            
        }
        if(phaseGroupData.sets[i].slots[1].prereqType=="seed")
        {
            
            matchArray[i].competitors.push(playerList[playerMap.get(parseInt(phaseGroupData.sets[i].slots[1].prereqId))!])  
        }
        
       


    }
    return matchArray
}

function numLosersRounds(numEntrants:number) {
    let toReturn = (Math.ceil(Math.log2(numEntrants))-1)*2
    let nextPowerOf2 = 2**Math.ceil(Math.log2(numEntrants))
    if(numEntrants<=0.75*nextPowerOf2) toReturn--
    return toReturn+1
}
async function clearByes(matchArray:Match[])
{
    
    for(let i=matchArray.length-1;i>=0;i--)
    {
       
        //if a match has byes, then delete it
        if(matchArray[i].competitors.length!=2||matchArray[i].competitors[0].seed==69420||matchArray[i].competitors[1].seed==69420)
        {
            
            matchArray.splice(i,1);
            
        }
    }
    
   return matchArray
}
async function fillByes(phaseGroupData:phaseGroupDataInterface,matchArray:Match[])
{
    for(let i=0;i<phaseGroupData.sets.length;i++)
    {
        if(phaseGroupData.sets[i].slots[0].prereqType=='bye')
        {
            let misterByeCopy=JSON.parse(JSON.stringify(misterBye))
            matchArray[i].competitors.push(misterByeCopy)
        }
        if(phaseGroupData.sets[i].slots[1].prereqType=='bye')
        {
            
            let misterByeCopy=JSON.parse(JSON.stringify(misterBye))
            matchArray[i].competitors.push(misterByeCopy)
        }
    }
    
    return matchArray
}
async function processBracket(matchArray:Match[],matchMap:Map<string|number,number >)
{
    

    
    for(let i=0;i<30;i++)
    {
        
        matchArray= JSON.parse(JSON.stringify(await processRound(matchArray)))
        
    }
   
    return matchArray
}

async function clearDoubleByes(matchArray:Match[])
{
    for(let i=matchArray.length-1;i>=0;i--)
    {
         //if a match has double byes, then delete it
         if(matchArray[i].competitors.length==2&&matchArray[i].competitors[0].seed==69420&&matchArray[i].competitors[1].seed==69420)
         {
            
            matchArray.splice(i,1);
            
         }
    }
    
   return matchArray
}
