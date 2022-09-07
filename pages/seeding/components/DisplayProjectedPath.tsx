
import Competitor from '../classes/Competitor';

import styles from '/styles/Home.module.css'
interface props {
    playerList: Competitor[];
}

export default function DisplayProjectedPath({playerList}:props)
{
    
    return(
        <div>
            <h3>Projected Path:</h3>
            { playerList.map((c:Competitor)=>
             <>
             <div className={styles.sublist} key={c.smashggID}>
                <h3 >{c.tag}</h3>
                
             </div>
             <br></br>
             </>
            )
            }
        </div>
    )
}
