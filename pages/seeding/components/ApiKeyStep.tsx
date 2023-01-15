
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
import { firebaseConfig } from '../../utility/firebaseConfig';
import queryFirebase from '../modules/queryFirebase';

//Initialize Firebase configuration
export const app = initializeApp(firebaseConfig);
const auth = getAuth();


interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    setApiKey: (apiKey: string) => void;
    setTournaments:(tournaments:Tournament[])=>void;
    
}

export default function ApiKeyStep({page,setPage,apiKey,setApiKey,setTournaments}:props)
{

    
    onAuthStateChanged(auth, (user) => {
        fillInApiKey(user)
    });
    function fillInApiKey(user:any) {
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
    

    
    
    const  handleSubmit = async () => {
        if(apiKey!=undefined)
        {
            await APICall(apiKey).then(async (value)=>
            {
              
                await setTournaments(apiDataToTournaments(value))
                
            })
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
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossOrigin="anonymous"></script>
                <p className={styles.headingtext}> Paste your API key from ‎  <a href="www.start.gg">     Start.gg</a></p>
                <div className={styles.vimembed}>
                    <iframe src="https://player.vimeo.com/video/766883703" width="640" height="360"  allow="autoplay; fullscreen" allowFullScreen></iframe>
                </div>
                <div className={styles.formsignin}>
                    <form >
                        <div className="form-floating textfieldtext">
                            <input type="password" className="form-control" id="floatingInput" placeholder="Enter your API key here" value={apiKey} onChange={e => setApiKey(e.target.value)}></input>
                            <label> API Key </label>
                        </div>
                    </form>
                </div>
                <SeedingFooter page={page} setPage={setPage} handleSubmit={handleSubmit} ></SeedingFooter>
            
            </div>
            
            </div>  
        
        </div>
    )
}
function apiDataToTournaments(apiData:any)
{
    let tournamentArray:Tournament[]=[]
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
    return tournamentArray;
}
function APICall(apiKey:string)
{
    
    //API call
    return axios.get('api/getAdminTournaments',{params:{apiKey:apiKey}}).then(({data})=>
        {
           
            return data
        }
    )
}

var db:any;
//saves the api key
function saveApiKey(apiKey:string|undefined) {
   
    if(!db) db = getDatabase();
    set(ref(db,"apiKeys/"+auth.currentUser!.uid), apiKey);
}



