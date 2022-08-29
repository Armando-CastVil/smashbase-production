
import Competitor from '../classes/Competitor';

import styles from '/styles/Home.module.css'
interface props {
    pList: Competitor[];
}

export default function DisplayProjectedPath({pList}:props)
{
    
    return(
        <div className={styles.CarpoolDisplay}>
            <h3>Projected Path:</h3>
            { pList.map((c:Competitor)=>
             <>
             <div className={styles.CarpoolDisplay} key={c.smashggID}>
                <h3 className={styles.CarpoolDisplay} >{c.tag}</h3>
                
             </div>
             <br></br>
             </>
            )
            }
        </div>
    )
}
