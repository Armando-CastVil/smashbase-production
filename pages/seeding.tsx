import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Seeding.module.css'
import bracketGradient  from "../assets/seedingAppPics/bracketGradient.png"
import Link from 'next/link';
import ApiKeyStep from '../seeding/components/ApiKeyStep'
import TournamentDisplayStep from '../seeding/components/TournamentDisplayStep'
import { useState } from "react";
import Tournament from '../seeding/classes/Tournament'
import Competitor from '../seeding/classes/Competitor'
import TourneyEvent from '../seeding/classes/TourneyEvent'
import EventDisplayStep from '../seeding/components/EventDisplayStep'
import PlayerListDisplayStep from '../seeding/components/PlayerListDisplayStep'
import CarpoolStep from '../seeding/components/CarpoolStep'
import FinalStep from '../seeding/components/FinalStep'
import SeedingIntro from '../seeding/components/SeedingIntro'
import SeedingOutro from '../seeding/components/SeedingOutro'
import Header from '../globalComponents/Header'
interface phaseGroupDataInterface
{
    
    phaseIDs:number[];
    phaseIDMap:Map<number, number[]>;
    seedIDMap:Map<number|string, number>;
    sets:any[];
}
const Seeding: NextPage = () => {
    //save data as states
    const [page, setPage] = useState<number>(0);
    const [apiKey,setApiKey]=useState<string|undefined>(undefined)
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [events, setEvents] = useState<TourneyEvent[]>([])
    const [playerList,setPlayerList]=useState<Competitor[]>([])
    const [eventSlug,setEventSlug]=useState<string|undefined>("")
    const [phaseGroups,setPhaseGroups]=useState<number[]|undefined>([])
    const [startTime,setStartTime]=useState<number|undefined>()
    const [endTime,setEndTime]=useState<number|undefined>()
    //this state will hold the processed data obtained from the api call
    //it's a hashmap with every value corresponding to an array of bracket IDs ordered by seed
    const [phaseGroupData,setPhaseGroupData]=useState<phaseGroupDataInterface>()
    
    

    const componentList = [
        <SeedingIntro
        key="SeedingIntro"
        page={page}
        setPage={setPage}
        setStartTime={setStartTime}
        />,
        <ApiKeyStep 
        key="ApiKeyStep"
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        setApiKey={setApiKey}
        setTournaments={setTournaments}
        />,
        <TournamentDisplayStep
        key="TournamentDisplayStep"
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        tournaments={tournaments}
        setEvents={setEvents}
        />,
        <EventDisplayStep
        key="EventDisplayStep"
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        events={events}
        setPlayerList={setPlayerList}
        slug={eventSlug}
        setEventSlug={setEventSlug}
        setPhaseGroups={setPhaseGroups}
        />,
        <PlayerListDisplayStep
        key="PlayerListDisplayStep"
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        playerList={playerList}
        setPlayerList={setPlayerList}
        slug={eventSlug}
        phaseGroups={phaseGroups}
        setPhaseGroupData={setPhaseGroupData}
        />
        ,
        <CarpoolStep
        key="CarpoolStep"
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        playerList={playerList}
        setPlayerList={setPlayerList}
        phaseGroupData={phaseGroupData}
        />,
        <FinalStep
        key="FinalStep"
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        playerList={playerList}
        setPlayerList={setPlayerList}
        slug={eventSlug}
        phaseGroups={phaseGroups}
        phaseGroupData={phaseGroupData!}
        setEndTime={setEndTime}
        /> ,
        <SeedingOutro
        slug={eventSlug}
        startTime={startTime}
        endTime={endTime}
        playerList={playerList}
        key="SeedingOutro" 
        />


    ];
    return (
        <div className={styles.body}>
            
            <title>SmashBase Seeding Tool</title>
            <meta name="description" content=""></meta>
            <meta name="generator" content="Hugo 0.104.2"></meta>
            <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossOrigin="anonymous"></link>
            <link rel="canonical" href="https://getbootstrap.com/docs/5.2/examples/sign-in/"></link>
            

            
    
            <div>{componentList[page]}</div>
            
            
        
        </div>   
      
  )
}


export default Seeding