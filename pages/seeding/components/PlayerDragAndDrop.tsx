
import { useState } from "react";
import { Carpool } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import AddToCarpoolButton from "./AddToCarpoolButton";
import CarpoolDropDownMenu from "./CarpoolDropDownMenu";
import styles from '/styles/Home.module.css'
import DisplayProjectedPath from "./DisplayProjectedPath";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DisplayCompetitorList from "./DisplayCompetitorList";
interface props {
    
    pList: Competitor[];
   
}

export default function PlayerDragAndDrop({pList}:props)
{
    const [playerList, setPlayerList] = useState(pList);

    function handleOnDragEnd(result:any) {
        if (!result.destination) return;
    
        const items = Array.from(pList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
    
       // updatePlayers(items);
      }
   
 
 
    
    


    return(
       <div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="players">
            
        {(provided) => (

        
            <ol className="players" {...provided.droppableProps} ref={provided.innerRef}>
            {pList.map(({tag,rating,smashggID}) => {
            return (
                <li key={smashggID}>
        
                    <p>{ tag }</p>
                    <br></br>
                    <p>{rating}</p>
                </li>
            );
            })}
            </ol>
        )}
        </Droppable>
        </DragDropContext>
       </div>
        
    

    )
        
}
