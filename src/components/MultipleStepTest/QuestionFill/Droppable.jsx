import styles from "./QuestionFill.module.scss";
import React from "react";
import {useDrop} from "react-dnd";

const Droppable = (props) => {
    const [{ isOver, handlerId}, drop] = useDrop(() => ({
        // The type (or types) to accept - strings or symbols
        accept: 'BOX',
        
        drop: (item,monitor)=> {
            
            onDropHandler(item.text );
            //console.log(monitor.getHandlerId())
            //({ name: 'dest'+monitor.getHandlerId() })
            
        },
        canDrop: (item) => {
            return !props.confirmed
        },

        


        //canDragEl: () => canMoveKnight(x, y),
        // Props to collect
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            handlerId: monitor.getHandlerId(),
        })
    }),[props])

    const onDropHandler = (text)=>{
       
        props.onDrop(props.position, text);
    }
/*
    const [droppedText, setDroppedText] = useState('');
*/

    
    return (
        <div  className={`${styles.droppable} ${handlerId} ${isOver ? styles.over : '' }`}
            ref={drop}
        >
            {props.text}
        </div>
    )
};

export default Droppable;