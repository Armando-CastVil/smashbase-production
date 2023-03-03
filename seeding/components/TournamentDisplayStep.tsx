import Image from 'next/image';
import styles from '/styles/Seeding.module.css'
import bracketGradient  from "/assets/seedingAppPics/bracketGradient.png"
import Tournament from '../classes/Tournament';
import axios from 'axios';
import TourneyEvent from '../classes/TourneyEvent';
import SeedingFooter from './SeedingFooter';
import DynamicTable from '@atlaskit/dynamic-table';
import { FC, useEffect, useState } from 'react';
import { css, jsx } from '@emotion/react';
import unixTimestampToDate from '../modules/unixTimestampToDate';
import { RowType } from '@atlaskit/dynamic-table/dist/types/types';
import { Checkbox } from '@atlaskit/checkbox';
import InlineMessage from '@atlaskit/inline-message';

//*note: use useEffect when refactoring
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    tournaments:Tournament[];
    setEvents:(events:TourneyEvent[]) => void;
    
}
export default function TournamentDisplayStep({page,setPage,apiKey,tournaments,setEvents}:props)
{

  //this state will manage which tournaments have been selected
  const [checkBoxes, setCheckBoxes] = useState<any[]>([])

  //value that verifies a tournament has been selected
  //0 is no event selected
  //1 is selected
  const [selectedStatus,setSelectedStatus]=useState<number>(3)

  //value to hold states, since they don't update immediately
  //0 is no event selected
  //1 is selected
  var status=3;
  
  //array of checkboxes
  let checkboxArray:any=[]

  //array of isChecked statues, either true or false
  let isCheckedStatus=[];

  //this is where the initial checkboxes are made
  for(let i=0;i<tournaments.length;i++)
  {
      
    let checkboxName=`checkbox${i}`
    isCheckedStatus.push(false)
    checkboxArray.push(
      <Checkbox
        value="default checkbox"
        name={checkboxName}
        size="large"
        isChecked={false}
      />
    )
  
  }
  //if the checkBoxes state hasn't been initialized, then set it to the initial checkboxes
  if(checkBoxes.length==0)
  {
  
  setCheckBoxes(checkboxArray)

  }
  

  //this function flips the checked box from checked to unchecked and vice versa
  //and sets all other boxes to unchecked
  async function updateCheckedBox(index:number)
  {
    const nextCheckedBoxes = checkBoxes.map((c, i) => 
    {
      let checkboxName=`checkbox${i}`
      if (i === index) 
      {
          //returns the checkbox with an alternated isChecked value, if box was checked then it is unchecked and vice versa
          return <Checkbox key={index} value="default checkbox"name={checkboxName} size="large" isChecked={!c.props.isChecked}/>
        
      } 
      else 
      {
        // The rest are set to false
        return <Checkbox key={index+1} value="default checkbox"name={checkboxName} size="large" isChecked={false} />
      }
    });

    setCheckBoxes(nextCheckedBoxes)
  }

  //handle submit function after next button is pressed
  const  handleSubmit = async () =>
  {

    //index of selected tournament
    let tourneyIndex:number=69420;
    //go through all the boxes and check if one has been selected
    for(let i=0;i<checkBoxes.length;i++)
    {
      if(checkBoxes[i].props.isChecked==true)
      {
        
        tourneyIndex=i
        status=1;
        setSelectedStatus(1)
      
        
        
      }
    }

    //if no box has been checked, exit submit function
    if(status!=1)
    {
      status=0;
      setSelectedStatus(0)
      return
    }
    //if a checked box was found, go through the submission motions
    else if(status==1)
    {
      
      APICall(apiKey!,tournaments[tourneyIndex].slug!).then((data)=>
      {
        setEvents(apiDataToTournaments(data))
      }
      )
      setPage(page+ 1);
    }

          
  }//end of handle submit

  //Don't know what this does but things break if we delete them
  interface NameWrapperProps 
  {
    children: React.ReactNode;
  }

  const NameWrapper: FC<NameWrapperProps> = ({ children }) => (
    <span >{children}</span>
  );

      
  //creates the heading for the dynamic table
  const createHead = (withWidth: boolean) => 
  {
      return {
        cells: [
          {
            key: 'Tournament Name',
            content: <p className={styles.seedHead}>Tournament Name</p>,
            isSortable: true,
            width: withWidth ? 30 : undefined,
          },
          {
            key: 'Date',
            content:<a className={styles.tableHead}>Date </a>,
            shouldTruncate: true,
            isSortable: true,
            width: withWidth ? 30 : undefined,
          },
          {
            key: 'Status',
            content:<a className={styles.tableHead}>Selected Status </a>,
            shouldTruncate: true,
            isSortable: true,
            width: withWidth ? 20 : undefined,
          },
        ],
      };
  };

  //sets the createHead function to true
  const head = createHead(true);

      const rows = tournaments.map((tournament: any, index: number) => ({
          key: `row-${index}-${tournament.name}`,
          isHighlighted: false,
          cells: [
            {
              
              key: createKey(tournament.name)+index,
              content: 
                <NameWrapper>
                  <img className={styles.seedRow} alt='tournament thumbnail' src={tournament.imageURL} width={24} height={24} ></img>
                  <p  className={styles.seedRow}>{tournament.name}</p>
                  
                </NameWrapper>
              ,
          
            },
            {
              key: tournament.startAt,
              content:(<NameWrapper><a className={styles.tableRow}>{unixTimestampToDate(parseInt(tournament.startAt))}</a></NameWrapper>),
            },
            {
              key: index,
              content:(
              <NameWrapper>
                {checkBoxes[index]}
              </NameWrapper>),
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

  async function onRowClick (e: React.MouseEvent, rowIndex: number) 
  {
    await updateCheckedBox(rowIndex)

  };
      
      


  return(

    <div>
      
      <div className={styles.upperBody}>
        
        <div className={styles.bodied}>

          <h1 className={styles.headingtext}>Tournaments you are admin of:</h1>

        <div className={styles.playerTable}>
          <DynamicTable
            head={head}
            rows={extendRows(rows,onRowClick)}
            rowsPerPage={10}
            defaultPage={1}
            loadingSpinnerSize="large"
            isRankable={false}
          />
        
        </div>
        <div className={styles.errorMessages}>
        {selectedStatus==0?
           <InlineMessage
           appearance="error"
           iconLabel="Error! No tournament has been selected."
           secondaryText="Please select a tournament."
           />:
           <p></p>
          }
        </div>
       
        <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit}  ></SeedingFooter>

      </div>

    </div>

  </div>
  )
  }
//takes the data obtained from the API call and turns it in to an array
function apiDataToTournaments(apiData:any)
{
    
    let eventArray:TourneyEvent[]=[]
    for(let i=0;i<apiData.data.tournament.events.length;i++)
    {
    
        let name:string=apiData.data.tournament.events[i].name;
        let id:number=apiData.data.tournament.events[i].id;
        let slug:string=apiData.data.tournament.events[i].slug;
        let numEntrants:number=apiData.data.tournament.events[i].numEntrants
        let tempEvent=new TourneyEvent(name,id,slug,numEntrants)
        eventArray.push(tempEvent)
    }
    
    return eventArray;
}

//actual API call
async function APICall(apiKey:string,slug:string)
{
    
    //API call
    const { data } = await axios.get('api/getTournamentEvents', { params: { apiKey: apiKey, slug: slug } });
    return data;
}
//creates a key for the table heads
function createKey(input: string) {
    return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}


