import Image from 'next/image';
import styles from '/styles/Seeding.module.css'
import bracketGradient  from "/assets/seedingAppPics/bracketGradient.png"
import Tournament from '../classes/Tournament';
import axios from 'axios';
import TourneyEvent from '../classes/TourneyEvent';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    tournaments:Tournament[];
    setEvents:(events:TourneyEvent[]) => void;
    
}
export default function TournamentDisplayStep({page,setPage,apiKey,tournaments,setEvents}:props)
{

    let hardCodedApiKey:string="06d2a6cd63f24966a65826634d8cc0e9"

    async function callAllOnClickFunctions(hardCodedApiKey:string,slug:string)
    {
        APICall(hardCodedApiKey,slug!).then((data)=>
        {
            setEvents(apiDataToTournaments(data))
        }
        )
        
        setPage(page + 1);
    }
    return(
        <div>
            <h1 className={styles.headingtext}>tournaments you are admin of:</h1>
            <div>
        
            {tournaments.map((t: Tournament) =>
            {
            return <>
            <div onClick={() =>callAllOnClickFunctions(hardCodedApiKey,t.slug!) } key={t.name} className={styles.tournaments} >
                <h3  >{t.name}</h3> <img src={t.imageURL} width={100} height={100} ></img>
                <h6 >Date: {t.startAt}</h6>
                <h6  id="tourneyLink"><a href={"smash.gg"+t.url} target="_blank" rel="noopener noreferrer">Link to Tournament</a> </h6>
                </div>
                <br/>
            </>
            })}
            </div>
           
        </div>
    )
}

function apiDataToTournaments(apiData:any)
{
    console.log("api data:")
    console.log(apiData)
    let eventArray:TourneyEvent[]=[]
    for(let i=0;i<apiData.data.tournament.events.length;i++)
    {
    
        let name:string=apiData.data.tournament.events[i].name;
        let id:number=apiData.data.tournament.events[i].id;
        let slug:string=apiData.data.tournament.events[i].slug;
        let tempEvent=new TourneyEvent(name,id,slug)
        eventArray.push(tempEvent)
    }
    
    return eventArray;
}

function APICall(apiKey:string,slug:string)
{
    
    //API call
    return axios.get('api/getTournamentEvents',{params:{apiKey:apiKey,slug:slug}}).then(({data})=>
        {
          
            return data
        }
    )
}

