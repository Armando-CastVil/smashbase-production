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
import DynamicTable from '@atlaskit/dynamic-table';
import SeedingFooter from './SeedingFooter';
import { FC } from 'react';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    events:Event[];
    setPlayerList:(events:any) => void;
    
}
export default function EventDisplayStep({page,setPage,apiKey,events,setPlayerList}:props)
{

    
    
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

    const rows = events.map((event: any, index: number) => ({
        key: `row-${index}-${event.name}`,
        isHighlighted: false,
        cells: [
          {
            key: createKey(event.name),
            content: 
              <NameWrapper>
                
                <a  className={styles.tableRow}>{event.name}</a>
                
              </NameWrapper>
            ,
          }
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
function createKey(input: string) {
    return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}


