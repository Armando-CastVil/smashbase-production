import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Seeding.module.css'
import bracketGradient  from "../assets/seedingAppPics/bracketGradient.png"
import Link from 'next/link';
import ApiKeyStep from './seeding/components/ApiKeyStep'
import TournamentDisplayStep from './seeding/components/TournamentDisplayStep'
import { useState } from "react";
import Tournament from './seeding/classes/Tournament'
import Competitor from './seeding/classes/Competitor'
import TourneyEvent from './seeding/classes/TourneyEvent'
import EventDisplayStep from './seeding/components/EventDisplayStep'
import PlayerListDisplayStep from './seeding/components/PlayerListDisplayStep'
import CarpoolStep from './seeding/components/CarpoolStep'
const Seeding: NextPage = () => {
    //save data as states
    const [page, setPage] = useState(0);
    const [apiKey,setApiKey]=useState<string|undefined>("")
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [events, setEvents] = useState<TourneyEvent[]>([])
    const [playerList,setPlayerList]=useState<Competitor[]>([])



    const componentList = [
        <ApiKeyStep
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        setApiKey={setApiKey}
        setTournaments={setTournaments}
        
        />,
        <TournamentDisplayStep
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        tournaments={tournaments}
        setEvents={setEvents}
        />,
        <EventDisplayStep
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        events={events}
        setPlayerList={setPlayerList}
        />,
        <PlayerListDisplayStep
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        playerList={playerList}
        setPlayerList={setPlayerList}/>,
        <CarpoolStep
        page={page}
        setPage={setPage}
        apiKey={apiKey}
        playerList={playerList}
        setPlayerList={setPlayerList}
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
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossOrigin="anonymous"></script>
            
        
        </div>   
      
  )
}


export default Seeding