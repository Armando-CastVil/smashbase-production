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
        const items = Array.from(playerList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPlayerList(items);
      }
   
 
 
    
    


    return(
        <div className="App">
            <header>
              
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="players">
                        {(provided) => (
                             <ol className="players" {...provided.droppableProps} ref={provided.innerRef}>
                                {playerList.map(({smashggID, tag, rating}, index) => {
                                    return (
                                        <Draggable key={smashggID} draggableId={smashggID.toString()} index={index}>
                                            {(provided) => (
                                                <li className={styles.list} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    
                                                        <p>Tag: { tag }</p>
                                                        <br></br>
                                                        <p>Power Level: {rating}</p>
                                                    
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
                </header>
            
        </div>

    

    )
        
}