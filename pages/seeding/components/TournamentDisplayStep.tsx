import Image from 'next/image';
import styles from '/styles/Seeding.module.css'
import bracketGradient  from "/assets/seedingAppPics/bracketGradient.png"
import Tournament from '../classes/Tournament';
import axios from 'axios';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    tournaments:Tournament[];
    setEvents:(events:any) => void;
    
}
export default function TournamentDisplayStep({page,setPage,apiKey,tournaments,setEvents}:props)
{

    console.log("inside tourney display component; tournaments are:")
    console.log(tournaments)
    
    return(
        <div>
            <h1 className={styles.headingtext}>tournaments you are admin of:</h1>
            <div>
        
            {tournaments.map((t: Tournament) =>
            {
          return <>
             
            <div  key={t.name} className={styles.tournaments} >
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

