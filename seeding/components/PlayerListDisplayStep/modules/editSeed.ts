import { arrayMoveImmutable } from "array-move";
import { Player } from "../../../definitions/seedingTypes";
import { log } from "../../../../globalComponents/modules/logs";



//this function replaces a player's seed with user input and updates everyone else's seeds accordingly
export default function editSeed(newSeed: number, index: number, players: Player[], setPreavoidanceplayerList: (preAvoidancePlayers: Player[]) => void,inputRefs: React.MutableRefObject<React.RefObject<HTMLInputElement>[]>) {
    //new seed and old seed variables to account for player list order restructuring
    //list must be sorted by seed, so all seeds change depending on the scenario
    //for example if seed 1 is sent to last seed, everyone's seed goes up by 1 etc.
    log("new seed:"+newSeed +" index :"+index)
    let oldSeed=players.indexOf(players[index])
    if (newSeed > players.length || newSeed <= 0) {

      if (inputRefs.current[index].current) {
        inputRefs.current[index].current!.value = (index + 1).toString();
      }
      return;
    } else {
      let newplayers = arrayMoveImmutable(
        players,
        oldSeed!,
        newSeed-1
      );
     setPreavoidanceplayerList(newplayers);
    }
  }