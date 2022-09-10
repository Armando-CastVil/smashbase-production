
import { Carpool } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import styles from '/styles/Home.module.css'
interface props {
    pList: Competitor[];
    cList: Carpool[];
    setPlayerFromButton: (player: Competitor) => void;
}

export default function CarpoolDisplay({pList,cList,setPlayerFromButton}:props)
{
    
    return(
        <div>
            <h3>carpools:</h3>
            { cList.map((c:Carpool)=>
             <>
             <div className={styles.list} key={c.carpoolName}>
               <h3 className={styles.sublist} >{c.carpoolName}</h3>
                {c.carpoolMembers.map((p:Competitor)=>
                <div className={styles.sublist}>
                    <h6>{p.tag}</h6>
                </div>
                )
                }
             </div>
             <br></br>
             </>
            )
            }
        </div>
    )
}
