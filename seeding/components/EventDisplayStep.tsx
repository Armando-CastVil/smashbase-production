import Image from 'next/image';
import styles from '/styles/Seeding.module.css'
import bracketGradient  from "../assets/seedingAppPics/bracketgradient.png"
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
import Checkbox from '@atlaskit/checkbox';
import InlineMessage from '@atlaskit/inline-message';
import queryFirebase from '../modules/queryFirebase';
import { getAuth } from 'firebase/auth';
import writeToFirebase from '../modules/writeToFirebase';
const auth = getAuth();
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

  const [eventPage, setEventPage] = useState<number>(1);
   
  //this state will manage which tournaments have been selected
  const [checkBoxes, setCheckBoxes] = useState<any[]>([])

  //value that verifies an event has been selected
  //0 is no event selected
  //1 is selected
  const [selectedStatus,setSelectedStatus]=useState<number>(3)
  //local variable to hold states, since states don't update immediately
  //0 is no event selected
  //1 is selected
  var status=3;
    
  //this array will hold the array of competitors that will be passed to the next step
  let tempPlayerList:Competitor[]=[]

  //array of checkboxes
  let checkboxArray:any=[]

  //array of isChecked statues, either true or false
  let isCheckedStatus=[];
  //this is where the initial checkboxes are made

  let instantSlug:string="";
  for(let i=0;i<events.length;i++)
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
  if(checkBoxes.length==0 &&events.length!=0)
  {
  
  setCheckBoxes(checkboxArray)

  }
  
  //handle submit function after next button is pressed
  const  handleSubmit = async () =>
  {
    //index of selected event
    let eventIndex:number=0;

    //go through all the boxes and check if one has been selected
    for(let i=0;i<checkBoxes.length;i++)
    {
      if(checkBoxes[i].props.isChecked==true)
      {
        
        eventIndex=i
        instantSlug=events[eventIndex].slug!
        setEventSlug(events[eventIndex].slug!)
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
      
        tempPlayerList=await getEntrantsFromSlug(events[eventIndex].slug!,apiKey!)
        setRating(tempPlayerList).then((playerListData)=>
        {
        
            setPlayerList(assignSeed(sortByRating(playerListData)))
            
        })

        setPhaseGroups(returnPhaseGroupArray(await getPhaseGroupWrapper(instantSlug, apiKey!)))
        let miniSlug = instantSlug.replace("/event/","__").substring("tournament/".length)
        let startsAddress = '/usageData/'+auth.currentUser!.uid+"/"+miniSlug+"/numStarts"
        let numStarts = await queryFirebase(startsAddress,0) as number | null
        if(numStarts == null)numStarts = 0
        await writeToFirebase(startsAddress,numStarts+1)
        console.log(await queryFirebase(startsAddress,0))
        console.log(startsAddress)
        setPage(page+ 1);
    }
    
    
  
  }//end of handle submit function

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
            key: 'Event Name',
            content: <a className={styles.seedHead}>Tournament Name</a>,
            isSortable: true,
            width: withWidth ? 30 : undefined
            
          },
          {
            key: 'Event Entrant Count',
            content: <a className={styles.tableHead}>Number of Entrants</a>,
            isSortable: true,
            width: withWidth ? 50 : undefined,
          },
          {
            key: 'Status',
            content:<a className={styles.tableHead}>Selected Status </a>,
            shouldTruncate: true,
            isSortable: true,
            width: withWidth ? 50 : undefined,
          },
        ],
      };
  };

  //sets the createHead function to true
  const head = createHead(true);

  const rows = events.map((event: any, index: number) => ({
      key: `row-${index}-${event.name}`,
      isHighlighted: false,
      cells: [
        {
          key: createKey(event.name),
          content: 
            <NameWrapper>
              
              <a  className={styles.seedRow}>{event.name}</a>
              
            </NameWrapper>
          
        },
        {
          key: createKey(event.name)+index,
          content: 
            <NameWrapper>
              
              <a  className={styles.tableRow}>{event.numEntrants}</a>
              
            </NameWrapper>
          
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
          return <Checkbox key={index}value="default checkbox"name={checkboxName} size="large" isChecked={!c.props.isChecked}/>
        
      } 
      else 
      {
        // The rest are set to false
        return <Checkbox key={index+1} value="default checkbox"name={checkboxName} size="large" isChecked={false} />
      }
    });

    setCheckBoxes(nextCheckedBoxes)
  }

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
                
                    <h1 className={styles.headingtext}>Events you are admin of:</h1>
                
                
                    
                    <div className={styles.eventTable}>
                      <DynamicTable
                        
                        head={head}
                        rows={extendRows(rows,onRowClick)}
                        rowsPerPage={10}
                        defaultPage={1}
                        onSetPage={(epage)=>setEventPage(epage)}
                        loadingSpinnerSize="large"
                        isRankable={true}

                      />

                    </div>
                    <div className={styles.errorMessages}>
                      {selectedStatus==0?
                      <InlineMessage
                        appearance="error"
                        iconLabel="Error! No event has been selected."
                        secondaryText="Please select an event."
                      />:
                      <p></p>
                      }
                    </div>
                    <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit} isDisabled={events.length===0}  ></SeedingFooter>

                
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

async function getPhaseGroupWrapper(slug:string,apiKey:string)
{
    let data:any;
    for(let i=0;i<10;i++)
    {
        await getPhaseGroup(slug,apiKey).then(async (value)=>
        {
            
            data=value
        })
        if(data==undefined)
        {
          continue
        }
        if(data!=undefined)
        {
          
          break
        }
        
    }
    return data
}


function returnPhaseGroupArray(apiData:any)
{
  let tempPhaseGroupArray:number[]=[]
  if(apiData)
  {
    
    for(let i=0;i<apiData.data.event.phaseGroups.length;i++)
  {
    tempPhaseGroupArray.push(apiData.data.event.phaseGroups[i].id)
  }
  }
  else
  {
    alert("no api data yet")
  }
  return tempPhaseGroupArray
}
function assignSeed(playerList:Competitor[])
{
  for(let i=0;i<playerList.length;i++)
  {
    playerList[i].seed=i+1
  }

  return playerList
}


