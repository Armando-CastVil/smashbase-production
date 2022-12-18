import Image from 'next/image';
import styles from '/styles/Seeding.module.css'
import bracketGradient  from "/assets/seedingAppPics/bracketGradient.png"
import Tournament from '../classes/Tournament';
import Event from '../classes/TourneyEvent';
import axios from 'axios';
import TourneyEvent from '../classes/TourneyEvent';
import getBracketData from '../modules/getBracketData';
import { setPlayerInfoFromPhase } from '../modules/setPlayerInfoFromPhase';
import assignBracketIds from '../modules/assignBracketIds';
import getMatchList from '../modules/getMatchList';
import setProjectedPath from '../modules/setProjectedPath';
import Competitor from '../classes/Competitor';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    events:Event[];
    setPlayerList:(events:any) => void;
    
}
export default function EventDisplayStep({page,setPage,apiKey,events,setPlayerList}:props)
{

    let hardCodedApiKey:string="06d2a6cd63f24966a65826634d8cc0e9"
    async function callAllOnClickFunctions(hardCodedApiKey:string,slug:string)
    {
        APICall(hardCodedApiKey,slug!).then((data)=>
        {
            apiDataToPlayerList(data,hardCodedApiKey,slug).then((playerList)=>
            {
                setPlayerList(playerList)
            })
        })
        
        setPage(page + 1);
    }
    async function apiDataToPlayerList(apiData:any,apiKey:string,slug:string)
{
    let phaseGroupArray:any=[];
        
        
        let apicallData: any=apiData;
        let rawData:any
        let tempPlayerList:Competitor[]=[];
        
        for(let i=0;i<apicallData.data.event.phaseGroups.length;i++)
        {
            phaseGroupArray.push(apicallData.data.event.phaseGroups[i].id)
        }
        
        for(let i=0;i<phaseGroupArray.length;i++)
        {
            let tempData:any
            if(i==0)
            {
                rawData=(await getBracketData(apicallData.data.event.phaseGroups[i].id,apiKey!))
            }
            else
            {
                console.log("phasegroup:")
                console.log(apicallData.data.event.phaseGroups[i].id)

                console.log("api key:")
                console.log(apiKey)
                tempData=(await getBracketData(phaseGroupArray[i],apiKey!))
                console.log("temp data")
                console.log(tempData)
                for(let j=0;j<tempData.phaseGroup.seeds.nodes.lenght;j++)
                {
                    rawData.phaseGroup.seeds.nodes.push(tempData.phaseGroup.seeds.nodes[i])
                    rawData.phaseGroup.sets.nodes.push(tempData.phaseGroup.sets.nodes[i])

                }
            }
        }
        
        
        tempPlayerList=await setPlayerInfoFromPhase(rawData)
        tempPlayerList=await assignBracketIds(rawData,tempPlayerList)
        let tempMatchList=await getMatchList(rawData,tempPlayerList)
        tempPlayerList=await setProjectedPath(tempMatchList,tempPlayerList)
        return tempPlayerList
        
        
}

    

    return(
        <div>
        <h1 className={styles.headingtext}>Select which event you want to seed:</h1>
        <div>
    
        {events.map((e: TourneyEvent) =>
        {
        return <>
        <div  onClick={() =>callAllOnClickFunctions(hardCodedApiKey,e.slug!) }  key={e.id} className={styles.events} >
            <h3  >{e.name}</h3> 
            <h3>{e.slug}</h3>
            </div>
            <br/>
        </>
        })}
        </div>
       
    </div>
    )
}



function APICall(apiKey:string,slug:string)
{
    
    //API call
    return axios.get('api/getPhaseGroup',{params:{apiKey:apiKey,slug:slug}}).then(({data})=>
        {
            return data
        }
    )
}
