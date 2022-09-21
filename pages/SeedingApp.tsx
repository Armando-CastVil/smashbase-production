import axios, { AxiosRequestConfig } from "axios";
import {useState } from "react";
import Competitor from "./seeding/classes/Competitor";
import { Carpool} from "./seeding/types/seedingTypes";
import getBracketData from "./seeding/modules/getBracketData";
import { setPlayerInfoFromPhase } from "./seeding/modules/setPlayerInfoFromPhase";
import urlToSlug from "./seeding/modules/urlToSlug";
import styles from '/styles/Home.module.css'
import DisplayCompetitorList from "./seeding/components/DisplayCompetitorList";
import CarpoolDisplay from "./seeding/components/CarpoolDisplay";
import GenerateBracketButton from "./seeding/components/UpdateBracketButton";
import assignBracketIds from "./seeding/modules/assignBracketIds";
import { Match } from "./seeding/types/seedingTypes";
import getMatchList from "./seeding/modules/getMatchList";
import getSeparation from "./seeding/modules/getSeparation";
import { NextConfig } from "next";
import setProjectedPath from "./seeding/modules/setProjectedPath";
import PageOne from "./seeding/components/PageOne";
import PageThree from "./seeding/components/PageThree";
import PageTwo from "./seeding/components/PageTwo";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./utility/firebaseConfig";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import SignInOut from "./seeding/components/SignInOut";

//Initialize Firebase stuff
const app = initializeApp(firebaseConfig);
const auth = getAuth();


//interface for the list of matches we will pass to the bracket display component
interface MatchStructure
{
    winners:Match[],
    losers:Match[]
}


//seeding app is the top level component 
export default function SeedingApp()
{

    //states are objects that store data. First element is where data is stored and second is the function
    //to set the data
    const [url,setURL] = useState("placeholder");
    const [playerList,setPlayerList]=useState<Competitor[]>([])
    const [carpoolList,setCarpoolList]=useState<Carpool[]>([])
    const [carpoolCount,setCarpoolCount]=useState<number>(0)
    const [selectedPlayer,setSelectedPlayer]=useState<Competitor>()
    const [selectedCarpool,setSelectedCarpool]=useState<Carpool>()
    const [apiData,setApiData]=useState<any>()
    const [apiKey,setApiKey]=useState<string|undefined>(getApiKey())
    const [matchList,setMatchList]=useState<MatchStructure>()
    const [phaseGroup,setPhaseGroup]=useState<any>()
    const [page,setPage]=useState<number>(1)
    const [authState] = useAuthState(auth);
    


    //page one setter functions
    //setter functions for states, these are passed as props to children components
    //so that they can pass data upwards by setting their parent's state
    function setKey(apiKey:string|undefined)
    {  
        setApiKey(apiKey)
    }
    function seturl(url:string|undefined)
    {
        setURL(url!)
        
    }

    

    //page three functions
    //setter functions
    //this function updates the selected carpool, it is passed down to the drop down list component
    const updateSelectedCarpool = (carpool: Carpool):void => {
    
    setSelectedCarpool(carpool)
    }

    const updateCompetitorList = (competitorList: Competitor[]):void => {
    
        
        setPlayerList(competitorList)
    }

    const updatePage=(pageNum:number):void=>
    {
        setPage(pageNum)
    }
    
    //function passed called by the create carpool button
    function createCarpool(e:any) {
        let carpoolAlias="carpool "+carpoolCount.toString()
      
        let tempCarpool:Carpool=
        {
            carpoolName: carpoolAlias,
            carpoolMembers: []
        }
        carpoolList.push(tempCarpool)
        setCarpoolCount(carpoolList.length)
        alert("carpool created"+ carpoolList[carpoolList.length-1].carpoolName)
        setCarpoolList(carpoolList)
    }
      //this function adds a player to a carpool and sets its carpool property to the selected carpool
      const addPlayerToCarpool=(player:Competitor):void=>
      {
          alert("added to carpool: "+selectedCarpool?.carpoolName+": "+player.tag)
          selectedCarpool!.carpoolMembers.push(player)
          player.carpool=selectedCarpool!
          setSelectedPlayer(player)
          setCarpoolCount(carpoolList.length)
  
      }

   
    const pushSeeding=async()=>
    {
        //mutateSeeding()
        console.log("seeding pushed to smashgg")
    }
    
    //to do
    const updateBracket=async (playerList:Competitor[])=>
    {
        let tempPlayerList:Competitor[]=[];
        tempPlayerList=await assignBracketIds(apiData,playerList)
        //setPlayerList(await assignBracketIds(apiData,playerList)) 
        let tempMatchList=await getMatchList(apiData,playerList)
        setMatchList(tempMatchList)
        getSeparation(playerList,carpoolList)
        setPlayerList(setProjectedPath(matchList!,playerList))
        console.log(playerList)
        console.log(tempMatchList)
    }
    
  

    //function called by the submit button. Retrieves bracket data from smashgg
    const handlePageOneSubmit= async (event: { preventDefault: () => void; })  => 
    {
        let phaseGroupArray:any=[];
        event.preventDefault();
        saveApiKey(apiKey);
        let apicallData: any;
        let rawData:any
        let tempPlayerList:Competitor[]=[];
        await APICall(urlToSlug(url)!,apiKey!).then((value)=>
        {
            apicallData=value
            console.log(apicallData)
        })
        for(let i=0;i<apicallData.data.event.phaseGroups.length;i++)
        {
            phaseGroupArray.push(apicallData.data.event.phaseGroups[i].id)
        }
       
        for(let i=0;i<phaseGroupArray.length;i++)
        {
            rawData=(await getBracketData(apicallData.data.event.phaseGroups[i].id,apiKey!))
        }
        rawData=(await getBracketData(apicallData.data.event.phaseGroups[0].id,apiKey!))
        tempPlayerList=await setPlayerInfoFromPhase(rawData)
        tempPlayerList=await assignBracketIds(rawData,tempPlayerList)
        let tempMatchList=await getMatchList(rawData,tempPlayerList)
        setPlayerList(setProjectedPath(tempMatchList,tempPlayerList))
        
        setApiData(rawData)
        setMatchList(tempMatchList)
        console.log(page)
        setPage(2)
    }

   

    
    //return statement
    return(
            <div className={styles.SeedingApp}>
            {authState?
            <div>
                {page==1?
                    <PageOne apikey={getApiKey()} setKey={setKey} setURL={seturl} handlePageOneSubmit={handlePageOneSubmit}  />
                    :
                    page==2?
                    <div>
                        <h3>change any players that are not rated correctly</h3>
                        <PageTwo pList={playerList} updatePage={updatePage}/>
                    </div>
                    
                    :
                    <div> 
                    <h3>add carpools</h3>
                    <button className={styles.button} onClick={e => { createCarpool(e) }}> create carpool</button> 
                    <PageThree  playerList={playerList} carpoolList={carpoolList} apiData={apiData} matchList={matchList} updateSelectedCarpool={updateSelectedCarpool} addPlayerToCarpool={addPlayerToCarpool} updateCompetitorList={updateCompetitorList} updatePage={updatePage}/>
                </div>
                
                }
            </div>
            :
            <div/>
            }
            <SignInOut auth={auth} authState={authState}/>
            </div>
        
        
    )
   

}


function saveApiKey(apiKey:string|undefined) {
    if (typeof window !== 'undefined') {
        localStorage.setItem("seedingAppApiKey",apiKey || "");
    }
}
function APICall(slug:string,apiKey:string)
{
    //API call
    return axios.get('api/getPhaseGroup',{params:{slug:slug,apiKey:apiKey}}).then(({data})=>
        {
           
            return data
        }
    )
}
function getApiKey() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("seedingAppApiKey") || "";
    } else {
        return "";
    }
}



