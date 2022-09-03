import Competitor from "../classes/Competitor";
import styles from '/styles/Home.module.css'

interface props {
    player: Competitor;
    addPlayerToCarpool: (arg: Competitor) => void
}
export default function AddToCarpoolButton({player,addPlayerToCarpool}:props)
{


return(
    <button className={styles.button} onClick={e => { addPlayerToCarpool(player) }}> add to carpool</button> 
)
}