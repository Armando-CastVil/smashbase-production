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
    const [submitStatus,setSubmitStatus]=useState(false);
    const [playerList,setPlayerList]=useState<Competitor[]>([])
    const [carpoolList,setCarpoolList]=useState<Carpool[]>([])
    const [carpoolCount,setCarpoolCount]=useState<number>(0)
    const [selectedPlayer,setSelectedPlayer]=useState<Competitor>()
    const [selectedCarpool,setSelectedCarpool]=useState<Carpool>()
    const [apiData,setApiData]=useState<any>()
    const [apiKey,setApiKey]=useState<string|undefined>(getApiKey())
    const [matchList,setMatchList]=useState<MatchStructure>()
    const [bracketSubmitStatus,setBracketSubmitStatus]=useState(false);

    
    //this function updates the selected carpool, it is passed down to the drop down list component
    const updateSelectedCarpool = (carpool: Carpool):void => {
    alert("selected carpool is:"+carpool.carpoolName)
    setSelectedCarpool(carpool)
    }

   //this function updates the API key, it is passed down to the setapi component
    const updateApiKey = (apiKey: string):void => {
        setApiKey(apiKey)
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
        setPlayerList(assignBracketIds(apiData,playerList)) 
        let tempMatchList=getMatchList(apiData,playerList)
        getSeparation(playerList,carpoolList)
        setMatchList(await tempMatchList)
    }
    
  

    //function called by the submit button. Retrieves bracket data from smashgg
    const handleSubmit= async (event: { preventDefault: () => void; })  => {
        event.preventDefault();
        saveApiKey(apiKey);
        await APICall(urlToSlug(url)!,apiKey!).then((value)=>
        {
            
            getBracketData(value.data.event.phaseGroups[0].id,apiKey!).then((value)=>
        {
    
            
            setApiData(value)
            setPlayerInfoFromPhase(value).then((value)=>
            {
                setPlayerList(value)
            })
            
            
        })
            setSubmitStatus(true)
        })    
        
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

    
    

   
 

    

      
    
    //return statement
    return(
            <div className={styles.SeedingApp}>
                {submitStatus?
                    <div className={styles.SeedingApp} >
                        <div className={styles.SeedingApp}>
                        <div className={styles.carpoolButton}>
                            <button className={styles.carpoolButton} onClick={e => { pushSeeding() }}> push seeding to smashgg</button> 
                        </div>

                        <GenerateBracketButton playerList={playerList} updateBracket={updateBracket} />
                        <DisplayCompetitorList pList={playerList} cList={carpoolList} updateSelectedCarpool={updateSelectedCarpool} addPlayerToCarpool={addPlayerToCarpool}/>
                        <CarpoolDisplay cList={carpoolList} pList={playerList} setPlayerFromButton={function (player: Competitor): void {
                        
                        } }/>
                        </div>
                        <div className={styles.carpoolButton}>
                            <button className={styles.carpoolButton} onClick={e => { createCarpool(e) }}> create carpool</button> 
                        </div>
                    </div>
                    :
                    <div>
                
                    <form onSubmit={e => { handleSubmit(e) }}>
                    <label>
                        API key:
                        <input type="password"  onChange={e => setApiKey(e.target.value)} defaultValue={getApiKey()}/> 
                        </label>
                        <br/>
                    <label>
                     Enter Bracket URL:
                    <input type="text"  onChange={e => setURL(e.target.value)}/> 
                    </label>
                    <input type="submit" value="Submit"  />
                    </form>
                    </div>
                }
            </div>
        
        
    )
   

}
function getApiKey() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem("seedingAppApiKey") || "";
    } else {
        return "";
    }
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


