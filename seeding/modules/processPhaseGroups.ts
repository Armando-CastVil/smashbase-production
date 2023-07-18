import getBracketData from "./getBracketData";
import { Match } from "../definitions/seedingTypes";
export default async function processPhaseGroups(phaseGroups:number[],apiKey:string)
{
    //phaseIDS are put in to an array
    let phaseIDs:number[]=[]
    //create hashmap for phase IDs
    let phaseIDMap = new Map<number, number[]>();
    //hashmap to give actual seed IDs 
    let seedIDMap=new Map<number|string, number>();
    //arrays to hold sets
    let sets:any=[]
    let phaseGroupApiData;

    
    
    let phaseGroupData=
    {
        phaseIDs,
        phaseIDMap,
        seedIDMap,
        sets
    }


    //this for loop goes through every phase phase group, makes the api call with it and sets the necessary data
    for(let i=0;i<phaseGroups.length;i++)
    {
        //api call
        phaseGroupApiData=await getBracketData(phaseGroups![i],apiKey!)
     
        //if the phaseID is not on the hashmap, create a key value pair with the phaseID as the key
        //and an empty array, where the seeds will go, as the value
        if(phaseGroupData.phaseIDMap.has(phaseGroupApiData.phaseGroup.phase.id)==false)
        {
            phaseGroupData.phaseIDs.push(phaseGroupApiData.phaseGroup.phase.id)
            let key=phaseGroupApiData.phaseGroup.phase.id
            let value:number[]=[]
            phaseGroupData.phaseIDMap.set(key,value)
        }
        //if the phaseID is on the hashmap, then push all the seeds in to the array
        if(phaseGroupData.phaseIDMap.has(phaseGroupApiData.phaseGroup.phase.id))
        {
            for(let j=0;j<phaseGroupApiData.phaseGroup.seeds.nodes.length;j++)
            {
                //bracket IDs are not ordered by seed, so we need to take the seed number from the api call
                //and turn it in to the index that will correspond to the array position, so the resulting array
                //will be ordered by seed even if the api call is not.
                let seedIndex:number=phaseGroupApiData.phaseGroup.seeds.nodes[j].seedNum;
                phaseGroupData.phaseIDMap.get(phaseGroupApiData.phaseGroup.phase.id)![seedIndex-1]=phaseGroupApiData.phaseGroup.seeds.nodes[j].id
                
                //fill the hashmap with the actual corresponding seed IDs
                if(phaseGroupApiData.phaseGroup.seeds.nodes[j].players!=null)
                {
                    seedIDMap.set(phaseGroupApiData.phaseGroup.seeds.nodes[j].players[0].id,phaseGroupApiData.phaseGroup.seeds.nodes[j].id)
                }
                
            }
        }
        
       
        //push all the sets in to an array
        for(let k=0;k<phaseGroupApiData.phaseGroup.sets.nodes.length;k++)
        {  
            phaseGroupData.sets.push(phaseGroupApiData.phaseGroup.sets.nodes[k])
        }

    }

    
    return phaseGroupData;



}