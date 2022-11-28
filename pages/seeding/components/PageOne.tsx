
import { Carpool } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import styles from '/styles/Seeding.module.css'
import { FormEvent, useState } from "react";
interface props {
    apikey:string|undefined
    setKey: (apiKey: string) => void;
    setURL: (url: string|undefined) => void;
    handlePageOneSubmit:(e:FormEvent)=>void
    
}

export default function PageOne({apikey,setKey,setURL,handlePageOneSubmit}:props)
{
   
    
    return(
        <div className={styles.form}>
            
            
            <form onSubmit={e => { handlePageOneSubmit(e) }}>
                <label>
                    API key:
                    <input type="password"  onChange={e => setKey(e.target.value)} defaultValue={apikey}/> 
                    </label>
                    <br/>
                <label>
                 Enter Bracket URL:
                <input type="text"  onChange={e => setURL(e.target.value)}/> 
                </label>
                <input type="submit" value="Submit"  />
                </form>
                
        </div>
    )
}


