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
import { FC, useState } from 'react';
import { RowType } from '@atlaskit/dynamic-table/dist/types/types';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    events:Event[];
    setPlayerList:(events:any) => void;
    slug:string|undefined;
    setEventSlug:(slug:string)=>void;
    setPhaseGroups:(phaseGroups:number[])=>void;
}
export default function EventDisplayStep({page,setPage,apiKey,events,setPlayerList,setEventSlug,slug,setPhaseGroups}:props)
{

    //state that will hold the index of the selected row
    const[highLightedRow,setHighLightedRow]=useState<number>()
    
    let tempPlayerList:Competitor[]=[]
    async function handleSubmit()
    {
        tempPlayerList=await getEntrantsFromSlug(slug!,apiKey!)
        setRating(tempPlayerList).then((playerListData)=>
        {
            
            setPlayerList(sortByRating(playerListData))
        })

        setPhaseGroups( returnPhaseGroupArray( await getPhaseGroup(slug!,apiKey!)))


          
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
              key: 'Event Name',
              content: <a className={styles.tableHead}>Tournament Name</a>,
              isSortable: true,
              width: withWidth ? 70 : undefined,
              
            }
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

      

      //object that includes rows and its functions
      const extendRows = (rows: Array<RowType>,onRowClick: (e: React.MouseEvent, rowIndex: number) => void,) => 
      {
        return rows.map((row, index) => ({
          ...row,
          onClick: (e: React.MouseEvent) => onRowClick(e, index),
        }));
      };

      function onRowClick (e: React.MouseEvent, rowIndex: number) 
      {
        rows[rowIndex].isHighlighted=true;
        setHighLightedRow(rowIndex);
        if(rowIndex!=undefined &&events.length!=0)
        {
          setEventSlug(events[rowIndex].slug!)
        }
        
      };
    

    return(
        <div>
            <div className={styles.upperBody}>
                <div className={styles.bodied}>
                
                    <h1 className={styles.headingtext}>Tournaments you are admin of:</h1>
                
                
                    
                    <div className={styles.tourneyTable}>
                    <DynamicTable
                        
                        head={head}
                        rows={extendRows(rows,onRowClick)}
                        rowsPerPage={10}
                        defaultPage={1}
            
                        loadingSpinnerSize="large"
                        isRankable={true}

                    />

                    </div>
                    <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit}  ></SeedingFooter>

                
                </div>
                
            </div>
           
        </div>
    )
}
function createKey(input: string) {
    return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}


async function getPhaseGroup(slug:string,apiKey:string)
{
    //API call
    const { data } = await axios.get('api/getPhaseGroup', { params: { slug: slug, apiKey: apiKey } });
    return data;
}

function returnPhaseGroupArray(apiData:any)
{
  let tempPhaseGroupArray:number[]=[]
  for(let i=0;i<apiData.data.event.phaseGroups.length;i++)
  {
    tempPhaseGroupArray.push(apiData.data.event.phaseGroups[i].id)
  }
  return tempPhaseGroupArray
}


