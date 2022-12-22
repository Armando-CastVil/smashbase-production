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
import getEntrantsFromSlug from '../modules/getEntrantsFromSlug';
import setRating from '../modules/setRating';
import sortByRating from '../modules/sortByRating';
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
    let tempPlayerList:Competitor[]=[]
    async function callAllOnClickFunctions(hardCodedApiKey:string,slug:string)
    {
        tempPlayerList=await getEntrantsFromSlug(slug,hardCodedApiKey)
        
        setRating(tempPlayerList).then((playerListData)=>
        {
            
            setPlayerList(sortByRating(tempPlayerList))
        })
        
        
        setPage(page + 1);
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



