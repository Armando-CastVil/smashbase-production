import Competitor from "../classes/Competitor";
import styles from '/styles/Home.module.css'

interface props {
    playerList: Competitor[];
    updateBracket: (playerList:Competitor[]) => void
}
export default function UpdateBracketButton({playerList,updateBracket}:props)
{


return(
    <button className={styles.button} onClick={e => { updateBracket(playerList) }}> Generate/Update Bracket</button> 
)
}