
import Image from 'next/image';
import styles from '/styles/Seeding.module.css'
import bracketGradient  from "/assets/seedingAppPics/bracketGradient.png"
import Tournament from '../classes/Tournament';
import axios from 'axios';
import { useState } from 'react';
import SeedingFooter from './SeedingFooter';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDatabase, set, ref } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../utility/firebaseConfig';
import queryFirebase from '../modules/queryFirebase';
import InlineMessage from '@atlaskit/inline-message';




//Initialize Firebase configuration
export const app = initializeApp(firebaseConfig);
const auth = getAuth();

//props passed from top level component(seeding.tsx)
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    setApiKey: (apiKey: string) => void;
    setTournaments:(tournaments:Tournament[])=>void;
    
}

export default function ApiKeyStep({page,setPage,apiKey,setApiKey,setTournaments}:props)
{
   
    //value that verifies if key is valid
    //0 is for api key that hasnt been input
    //1 is for undefined api key
    //2 is for not valid api key
    //3 is for valid api key
    const [keyStatus,setKeyStatus]=useState<number>(0)
    //because a state change triggers a re-render, we cannot use one to go to next page w/o submitting twice
    //so we will use another variable instead of a state for that
    let keyIsGood=false
    //fills in api key 
    onAuthStateChanged(auth, (user) => 
    {
        fillInApiKey(user)
    });
    function fillInApiKey(user:any) 
    {
        //only look for api key if they are logged in and its not already there
        if (!(user && (apiKey == null || apiKey == ""))) return;
        const uid = user.uid;
        //pull it from firebase
        queryFirebase("apiKeys/"+uid,0).then((value) => {
            //check firebase first
            if(value != null) setApiKey(value);
            //then check local storage
            else if (typeof window !== 'undefined') {
                setApiKey(localStorage.getItem("seedingAppApiKey") || "");
            } else {
                //if its in neither place, just set it to empty string
                setApiKey("");
            }
        });
    }


function handleKeyPress(event: { key: string; preventDefault: () => void; }) 
{
     // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    handleSubmit()
  }
    
}
    
//this function handles the data returned by the api call
function apiDataToTournaments(apiData:any)
{
    //tournaments are stored here
    let tournamentArray:Tournament[]=[]
    //data is undefined if an invalid key was provided by user
    if(apiData.data==undefined)
    {
        setKeyStatus(2)
        return tournamentArray
    }
    //if the key is valid but the length is 0, then the user is not an admin of any tournaments
    else if(apiData.data.currentUser.tournaments.nodes.length==0)
    {
        setKeyStatus(3)
        return tournamentArray
    }
    else
    {
        //if we made it to here it is because there is data, this is then processed
        for(let i=0;i<apiData.data.currentUser.tournaments.nodes.length;i++)
        {
        
            let name:string=apiData.data.currentUser.tournaments.nodes[i].name
            let city:string=apiData.data.currentUser.tournaments.nodes[i].city
            let url:string=apiData.data.currentUser.tournaments.nodes[i].url
            let slug:string=apiData.data.currentUser.tournaments.nodes[i].slug
            let startAt:number=apiData.data.currentUser.tournaments.nodes[i].startAt
            let imageURL=undefined
            if(apiData.data.currentUser.tournaments.nodes[i].images.length!=0)
            {
                imageURL=apiData.data.currentUser.tournaments.nodes[i].images[0].url
            }
            
            
            let tempTournament=new Tournament(name,city,url,slug,startAt,imageURL)
            tournamentArray.push(tempTournament)
        }

    }
   
    return tournamentArray;
}

//this function handles the user's submitted api key  
const  handleSubmit = async () => 
{
    
    
    
    
    //if no api key is entered by the user, they are made aware and function is exited
    if(apiKey==undefined || apiKey.length==0)
    {
        setKeyStatus(1)
        return
    }

    //if user does enter a value, we check if it returns tournaments from the api call
    //either the api key is invalid, or the user is not an admin of any tournaments, this
    //is handled in the apiDataToTournaments function
    if(apiKey!=undefined)
    {
        await APICall(apiKey).then(async (value)=>
        {
            
            //we make the api call with the user's provided api key
            setTournaments(apiDataToTournaments(value)!)
            //if it doesnt return a tournament, either api key is invalid or they are not an admin of any tournaments
            //so we return
            if(value.data==undefined)
            {
                
                return
            }
            //tournaments are stored in the value variable, if it is not empty then it means there are
            //tournaments and we can proceed
            else
            {
                
                keyIsGood=true
                
            }    

        })

        //only goes to the next page if the key is valid
        if(keyIsGood)
        {
            setPage(page+ 1);
        }
        //return if it's not valid
        else return
    }

    
       
}




    
return(


        <div>
            
            
            
            <title>SmashBase Seeding Tool</title>
            <meta name="description" content=""></meta>
            <meta name="generator" content="Hugo 0.104.2"></meta>
            <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossOrigin="anonymous"></link>
            <link rel="canonical" href="https://getbootstrap.com/docs/5.2/examples/sign-in/"></link>
            
            <div className={styles.upperBody}>
            <div className={styles.bodied}>
                <p className={styles.headingtext}> Paste your API key from ‎  <a href="www.start.gg">     Start.gg</a></p>
                <div className={styles.vimembed}>
                    <iframe src="https://player.vimeo.com/video/801722317?h=7bfa580f84&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="640" height="360"  allow="autoplay; fullscreen" allowFullScreen></iframe>
                </div>
                <div className={styles.formsignin}>
                    <form >
                        <div className="form-floating textfieldtext">
                            <input type="password" className="form-control" id="floatingInput" placeholder="Enter your API key here" value={apiKey} onKeyDown={e=>handleKeyPress(e)}  onChange={e => setApiKey(e.target.value)}></input>
                            <label> Enter your API Key here </label>
                        </div>
                    </form>
                </div>
                <div className={styles.errorMessages}>
                    {keyStatus==0?
                    <p></p>:
                    keyStatus==1?
                    <InlineMessage
                    appearance="error"
                    iconLabel="Error! API Key form is empty."
                    secondaryText="API Key form is empty."
                    >
                    <p>Please enter your API Key</p>
                    </InlineMessage>
                    :
                    keyStatus==2?
                    <InlineMessage
                    appearance="error"
                    iconLabel="Error! API Key form is not valid."
                    secondaryText="API Key form is not valid."
                    >
                    <p>Please enter a valid API Key</p>
                    </InlineMessage>
                    :
                    keyStatus==3?
                    <InlineMessage
                    appearance="error"
                    iconLabel="Error! No tournaments were found under this API Key user"
                    secondaryText="No tournaments were found under this API Key user."
                    >
                    <p>Please make sure you are an admin for the tournament you want to seed</p>
                    </InlineMessage>
                    :
                    <InlineMessage
                    appearance="confirmation"
                    secondaryText="Valid API Key!"
                    >
                    <p>Valid API Key!</p>
                    </InlineMessage>
                }
                {keyIsGood?
                <InlineMessage
                appearance="confirmation"
                secondaryText="Valid API Key!"
                >
                <p>Valid API Key!</p>
                </InlineMessage>:
                <p></p>


                }

                </div>
                
                
                
                <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit} ></SeedingFooter>
            
            </div>
            
            </div>  
        
        </div>
    )
}


//function for api call
async function APICall(apiKey:string)
{
    
    //API call
    return axios.get("api/getAdminTournaments",{params:{apiKey:apiKey}}).then(({data})=>
        {
           
            return data
        }
    )
}








