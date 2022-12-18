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
import PlayerDragAndDrop from './PlayerDragAndDrop';
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    playerList:Competitor[];
    setPlayerList:(competitors:Competitor[]) => void;
    
}
export default function PlayerListDisplayStep({page,setPage,apiKey,playerList,setPlayerList}:props)
{

    <button
    onClick={() => {

        setPage(page + 1);
        
    }}>
Next
</button>
    
    
    return(
        
            <div >
                <button
                    onClick={() => {
                        setPage(page + 1);
        
                    }}>
                    Next
                </button>
                <PlayerDragAndDrop pList={playerList}/>
            </div>
    )
    
}


          