import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { Carpool } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import PlayerDragAndDrop from "./PlayerDragAndDrop";

import styles from '/styles/Home.module.css'
import DisplayProjectedPath from "./DisplayProjectedPath";
interface props {
    pList: Competitor[]; 
    updatePage:(arg:number)=>void
}



export default function PageTwo({pList, updatePage}:props)
{


     //handles the submission button for page two
     const handlePageTwoSubmit= async (event: { preventDefault: () => void; })  => 
     {
 
         updatePage(3)
     }

    
       

    


    return(
        <div >
            <button className={styles.button}  onClick={e => { handlePageTwoSubmit(e) }}>Proceed to carpools</button>
            <PlayerDragAndDrop pList={pList}/>
        </div>
    )
        
}
