import styles from "./QuestionFill.module.scss";
import React from "react";
import {useDrag} from "react-dnd";

const Draggable = (props)=>{

    const [{ isDragging, handlerId }, drag, dragPreview] = useDrag(() => ({
        // "type" is required. It is used by the "accept" specification of drop targets.
        type: 'BOX',
        item: {text: props.text, key:props.dragIndex},
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
              alert(`You dropped ${item.key} into ${dropResult.dragged}!`)
            }
        },
        canDrag: ()=>!props.confirmed,
        // The collect function utilizes a "monitor" instance (see the Overview for what this is)
        // to pull important pieces of state from the DnD system.
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        })
    }),[props])
    
    return isDragging ? <div ref={dragPreview} /> : <div ref={drag} className={styles.draggable} style={{ opacity: isDragging ? 0.5 : 1}}>
                {/* The drag ref marks this node as being the "pick-up" node */}
            <div ref={drag} >{props.text}</div>
        </div>

}

export default Draggable;
