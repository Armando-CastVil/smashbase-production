import Competitor from "../classes/Competitor";
import { Match } from "../types/seedingTypes";
import assignBracketIds from "./assignBracketIds";
import processRound from "./processRounds";

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
    let matchMap = new Map<string,number >();

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
    

     

    //put key value pairs in hashmap
    for(let i=0;i<phaseGroupData.sets.length;i++)
    {
       
        //make this id the key for the hash map
        let key:string=phaseGroupData.sets[i].id

        //make the match we just pushed to the match array as the value
        let value:number=i

        //push this in to the hash map
        matchMap.set(key,value)
    }


    await setBasicProperties(phaseGroupData,matchArray)
    await setInitialCompetitors(phaseGroupData,matchArray,playerList,playerMap)
    await setNextMatches(matchMap,matchArray,phaseGroupData)
    
    
    /*
    
    for(let i=0;i<rounds;i++)
    {
        matchArray=processRound(matchArray,matchMap)
        
    }*/
    
    return matchArray



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
async function setNextMatches(matchMap:Map<string,number >,matchArray:Match[],phaseGroupData:phaseGroupDataInterface)
{
    console.log(matchArray)
    for(let i=0;i<phaseGroupData.sets.length;i++)
    {
        //if(phaseGroupData.sets[i].slots[0].prereqType=='set' && phaseGroupData.sets[i].slots[1].prereqType=='set')
        //if a match is in winners, then the two sets leading up to it are also both in winners
        if(phaseGroupData.sets[i].round>0)
        {
            //process slot 0 and slot 1 independently, because a bye doesn't have a prerequisite

            //process slot 0
            if(phaseGroupData.sets[i].slots[0].prereqType=='set')
            {
                matchArray[matchMap.get(phaseGroupData.sets[i].slots[0].prereqId)!].nextWinnersMatchId=phaseGroupData.sets[i].id;
            }

            //process slot 1
            if(phaseGroupData.sets[i].slots[1].prereqType=='set')
            {
                matchArray[matchMap.get(phaseGroupData.sets[i].slots[1].prereqId)!].nextWinnersMatchId=phaseGroupData.sets[i].id;
            }

           
           
        }

        //if a match is in losers,
        if(phaseGroupData.sets[i].round<0)
        {
            //process slot 0 and slot 1 independently, because a bye doesn't have a prerequisite

            //process slot 0
            if(phaseGroupData.sets[i].slots[0].prereqType=='set')
            {
                matchArray[matchMap.get(phaseGroupData.sets[i].slots[0].prereqId)!].nextLosersMatchId=phaseGroupData.sets[i].id;
            }

            //process slot 1
            if(phaseGroupData.sets[i].slots[1].prereqType=='set')
            {
                
                matchArray[matchMap.get(phaseGroupData.sets[i].slots[1].prereqId)!].nextLosersMatchId=phaseGroupData.sets[i].id;
            }
            
            
        }

        
    }
    

    //this loop is to process the match array properly, deleting the matches with
    //byes and setting the next losers match id to bypass byes completely
    for(let i=0;i<matchArray.length;i++)
    {
        

        //if a matches next losers match has a bye, then find that matches next match until no bye is found and
        //assign it to the current match. this is to bypass having to process matches with byes
        
        //check if the current matches next losers match exists and has a bye
       
        if(matchArray[i].nextLosersMatchId!=undefined&&matchArray[i].nextLosersMatchId!=null&&matchArray[i].nextLosersMatchId!="")
        {

            //if the current match has a next losers match with a bye
            if(phaseGroupData.sets[matchMap.get(matchArray[i].nextLosersMatchId!)!].slots[0].prereqType=="bye"||phaseGroupData.sets[matchMap.get(matchArray[i].nextLosersMatchId!)!].slots[1].prereqType=="bye")
            {
                //make a temporary next losers match id, we know this one has a bye
                let tempID=matchArray[i].nextLosersMatchId
                //if the current tempID has any byes, get the next losers match until you get one w/o byes
                while(phaseGroupData.sets[matchMap.get(matchArray[matchMap.get(tempID!)!].nextLosersMatchId!)!].slots[0].prereqType=="bye"||phaseGroupData.sets[matchMap.get(matchArray[matchMap.get(tempID!)!].nextLosersMatchId!)!].slots[1].prereqType=="bye")
                {
                    tempID=matchArray[matchMap.get(tempID!)!].nextLosersMatchId!
                }
                matchArray[i].nextLosersMatchId=tempID

            }

        }
        

        //if a match has byes, then delete it
        if(phaseGroupData.sets[i].slots[0].prereqType=='bye'||phaseGroupData.sets[i].slots[1].prereqType=='bye')
        {
            matchArray.splice(i,1)
        }


    }
    
    return matchArray
}

async function setInitialCompetitors(phaseGroupData:phaseGroupDataInterface,matchArray:Match[],playerList:Competitor[],playerMap:Map<number,number>)
{
    
    for(let i=0;i<phaseGroupData.sets.length;i++)
    {
        if(phaseGroupData.sets[i].round==1 && phaseGroupData.sets[i].slots[0].prereqType=="seed"&&phaseGroupData.sets[i].slots[0].seed!=null)
        {
            
            matchArray[i].competitors.push(playerList[playerMap.get(phaseGroupData.sets[i].slots[0].seed.id)!])
        }

        if(phaseGroupData.sets[i].round==1 && phaseGroupData.sets[i].slots[1].prereqType=="seed"&&phaseGroupData.sets[i].slots[1].seed!=null)
        {
            
            matchArray[i].competitors.push(playerList[playerMap.get(phaseGroupData.sets[i].slots[1].seed.id)!])
        }

        if(phaseGroupData.sets[i].round==1 && phaseGroupData.sets[i].slots[0].prereqType=="seed"&&phaseGroupData.sets[i].slots[0].seed==null)
        {
            
            matchArray[i].competitors.push(playerList[playerMap.get(parseInt(phaseGroupData.sets[i].slots[0].prereqId))!])
        }

        if(phaseGroupData.sets[i].round==1 && phaseGroupData.sets[i].slots[1].prereqType=="seed"&&phaseGroupData.sets[i].slots[1].seed==null)
        {
           
            matchArray[i].competitors.push(playerList[playerMap.get(parseInt(phaseGroupData.sets[i].slots[1].prereqId))!])
        }
        
     

    }
    
}

function numLosersRounds(numEntrants:number) {
    let toReturn = (Math.ceil(Math.log2(numEntrants))-1)*2
    let nextPowerOf2 = 2**Math.ceil(Math.log2(numEntrants))
    if(numEntrants<=0.75*nextPowerOf2) toReturn--
    return toReturn+1
}

