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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
interface props {
    page:number;
    setPage:(page:number) => void;
    apiKey:string|undefined;
    playerList:Competitor[];
    setPlayerList:(competitors:Competitor[]) => void;
    
}
export default function PlayerListDisplayStep({page,setPage,apiKey,playerList,setPlayerList}:props)
{
    //function that rearranges items when user stops dragging and drops
    function handleOnDragEnd(result:any) {
        if (!result.destination) return;
        const items = Array.from(playerList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPlayerList(items);
      }
    
  
    return(
        
            <div >
                <h1>ABSOLUTELY PUSHING PEE</h1>
                <button
            onClick={() => {
                setPage(page + 1);

            }}>
            Next
        </button>
                
                
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="players">
                        {(provided) => (
                             <ol className="players" {...provided.droppableProps} ref={provided.innerRef}>
                                {playerList.map(({smashggID, tag, rating}, index) => {
                                    return (
                                        <Draggable  key={smashggID} draggableId={smashggID.toString()} index={index}>
                                            {(provided) => (
                                                <li className={styles.list} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    
                                                        <p>Tag: { tag }</p>
                                                        <br></br>
                                                        <p>Rating: {rating}</p>
                                                    
                                                </li>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </ol>

                        )}
                    </Droppable>

                </DragDropContext>
            </div>
            
        

                
           
  
    )
    
}


          