import Image from 'next/image';
import styles from '/styles/Seeding.module.css'
import bracketGradient  from "/assets/seedingAppPics/bracketGradient.png"
import Tournament from '../classes/Tournament';
import axios from 'axios';
import TourneyEvent from '../classes/TourneyEvent';
import SeedingFooter from './SeedingFooter';
import DynamicTable from '@atlaskit/dynamic-table';
import { FC } from 'react';
import { css, jsx } from '@emotion/react';
import unixTimestampToDate from '../modules/unixTimestampToDate';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    tournaments:Tournament[];
    setEvents:(events:TourneyEvent[]) => void;
    
}
export default function TournamentDisplayStep({page,setPage,apiKey,tournaments,setEvents}:props)
{

    

    async function callAllOnClickFunctions(hardCodedApiKey:string,slug:string)
    {
        APICall(hardCodedApiKey,slug!).then((data)=>
        {
            setEvents(apiDataToTournaments(data))
        }
        )
        
        setPage(page + 1);
    }

    interface NameWrapperProps 
    {
        children: React.ReactNode;
    }

    const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
        <span >{children}</span>
    );

    
    

    

    const createHead = (withWidth: boolean) => 
    {
        return {
          cells: [
            {
              key: 'Tournament Name',
              content: <a className={styles.tableHead}>Tournament Name</a>,
              isSortable: true,
              width: withWidth ? 70 : undefined,
            },
            {
              key: 'Date',
              content:<a className={styles.tableHead}>Date </a>,
              shouldTruncate: true,
              isSortable: true,
              width: withWidth ? 100 : undefined,
            },
          ],
        };
    };

    const head = createHead(true);

    const rows = tournaments.map((tournament: any, index: number) => ({
        key: `row-${index}-${tournament.name}`,
        isHighlighted: false,
        cells: [
          {
            key: createKey(tournament.name),
            content: 
              <NameWrapper>
                <img src={tournament.imageURL} width={24} height={24} ></img>
                <a  className={styles.tableRow}>{tournament.name}</a>
                
              </NameWrapper>
            ,
          },
          {
            key: tournament.startAt,
            content:(<NameWrapper><a className={styles.tableRow}>{unixTimestampToDate(parseInt(tournament.startAt))}</a></NameWrapper>),
          },
        ],
      }));
    


    
    return(
        <div>
            <div className={styles.upperBody}>
                <div className={styles.bodied}>
                
                    <h1 className={styles.headingtext}>Tournaments you are admin of:</h1>
                
                
                    
                    <div className={styles.tourneyTable}>
                    <DynamicTable
                        
                        head={head}
                        rows={rows}
                        rowsPerPage={10}
                        defaultPage={1}
            
                        loadingSpinnerSize="large"
                        isRankable={true}
                    />

                    </div>
                    <SeedingFooter page={page} setPage={setPage}  ></SeedingFooter>

                
                </div>
                
            </div>
           
        </div>
    )
}

function apiDataToTournaments(apiData:any)
{
    
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

function createKey(input: string) {
    return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

/*
   {tournaments.map((t: Tournament) =>
                        {
                            return <>
                            <div onClick={() =>callAllOnClickFunctions(apiKey!,t.slug!) } key={t.name} className={styles.tournaments} >
                            <h3  >{t.name}</h3> <img src={t.imageURL} width={100} height={100} ></img>
                            <h6 >Date: {t.startAt}</h6>
                            <h6  id="tourneyLink"><a href={"smash.gg"+t.url} target="_blank" rel="noopener noreferrer">Link to Tournament</a> </h6>
                            </div>
                            <br/>
                            </>
                    })}
*/
