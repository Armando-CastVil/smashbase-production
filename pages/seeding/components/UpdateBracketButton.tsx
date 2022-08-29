import Competitor from "../classes/Competitor";

interface props {
    playerList: Competitor[];
    updateBracket: (playerList:Competitor[]) => void
}
export default function UpdateBracketButton({playerList,updateBracket}:props)
{


return(
    <button color="red" onClick={e => { updateBracket(playerList) }}> Generate/Update Bracket</button> 
)
}