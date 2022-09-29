
import { useState } from "react";
import { Carpool } from "../types/seedingTypes";
import Competitor from "../classes/Competitor";
import AddToCarpoolButton from "./AddToCarpoolButton";
import CarpoolDropDownMenu from "./CarpoolDropDownMenu";
import styles from '/styles/Home.module.css'
import DisplayProjectedPath from "./DisplayProjectedPath";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
interface props {
    
    pList: Competitor[];
    
}

export default function PlayerDragAndDrop({pList}:props)
{
    const [playerList, setPlayerList] = useState([pList]);

    const grid = 8;

    function onDragEnd(result:any) {
        if (!result.destination) {
          return;
        }
        if (result.destination.index === result.source.index) {
            return;
          }
    }
    const reorder = (list:Competitor[], startIndex:number, endIndex:number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
      };
    const PlayerItem =`
    width: 200px;
    border: 1px solid grey;
    margin-bottom: ${grid}px;
    background-color: lightblue;
    padding: ${grid}px;
    `;
 
    


    return(
        
    <DragDropContext onDragEnd={onDragEnd}>
      
    </DragDropContext>

    )
        
}
