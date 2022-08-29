import Competitor from "../classes/Competitor"
import setAllNextMatchIDs from "./setAllNextMatchIDs"
import { Match } from "../types/seedingTypes"


//generic info for a bye
var bye:Competitor= new Competitor("",0,"Bye",0,1000000,undefined,undefined,false)
   

//this function fills in only the sets that have data for both Competitors already before tournament start
//byes count as a competitor, so bye vs player, player vs player and bye vs bye. These are the initial rounds
export default function fillInitialRounds(data:any,playerList:Competitor[])
{
    //the sets will be stored here
    var setList:Match[]=[]

    //this array holds the bracket ids of all the players in order of their seeding to
    //make looking them up easier using the indexof method
    var bracketIDs:any=[]
    //also assigns their bracket ID to their corresponding index in the bracketID array
    for(let i=0;i<playerList.length;i++)
    {
        bracketIDs[i]=playerList[i].bracketID
        
    }

    //go through all the sets 
    for(let i=0;i<data.phaseGroup.sets.nodes.length;i++)
    {
        //set the attributes that dont depend on Competitors
        setList[i]=
        {
            id:data.phaseGroup.sets.nodes[i].id,
            name:data.phaseGroup.sets.nodes[i].identifier,
            nextWinnersMatchId:null,
            nextLosersMatchId: undefined,
            Competitors:[]

        }
        //fill all byes
        if(data.phaseGroup.sets.nodes[i].slots[0].prereqType=='bye')
        {
            setList[i].Competitors.push(bye) 
        }
        //fill all byes
        if(data.phaseGroup.sets.nodes[i].slots[1].prereqType=='bye')
        {
            setList[i].Competitors.push(bye) 
        }

        //if it's the first round
        if(data.phaseGroup.sets.nodes[i].round==1)
        {
            //if seed does not equal null, it means there's a player in that slot
            if(data.phaseGroup.sets.nodes[i].slots[0].seed !=null)
            {
                var competitor:Competitor= new Competitor
                (
                    "",
                    playerList[bracketIDs.indexOf(data.phaseGroup.sets.nodes[i].slots[0].seed.id)].bracketID,
                    playerList[bracketIDs.indexOf(data.phaseGroup.sets.nodes[i].slots[0].seed.id)].tag,
                    playerList[bracketIDs.indexOf(data.phaseGroup.sets.nodes[i].slots[0].seed.id)].rating,
                    bracketIDs.indexOf(data.phaseGroup.sets.nodes[i].slots[0].seed.id)+1,
                    undefined,
                    undefined,
                    false

                )
               

                
                setList[i].Competitors.push(competitor) 
            }
          

            if(data.phaseGroup.sets.nodes[i].slots[1].seed !=null)
            {
                var competitor:Competitor= new Competitor
                (
                    "",
                    playerList[bracketIDs.indexOf(data.phaseGroup.sets.nodes[i].slots[1].seed.id)].bracketID,
                    playerList[bracketIDs.indexOf(data.phaseGroup.sets.nodes[i].slots[1].seed.id)].tag,
                    playerList[bracketIDs.indexOf(data.phaseGroup.sets.nodes[i].slots[1].seed.id)].rating,
                    bracketIDs.indexOf(data.phaseGroup.sets.nodes[i].slots[0].seed.id)+1,
                    undefined,
                    undefined,
                    false

                )
              
                competitor.isWinner=false
                setList[i].Competitors.push(competitor)
            }

        }
        


    }

    

    setList=setAllNextMatchIDs(data,setList)
    console.log("setList after initial round processing")
    console.log(setList)
    return setList


}