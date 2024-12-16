import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import styles from "./SortableItem.module.scss";
import {useRef, useState} from 'react';

const SortableItem = ({id, ok, ko, index, text, correctOrder,handleReorder,touched,position})=>{

   // const [touched, setTouched] = useState(false)


   /* const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable( {id: id});
   

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };*/

    return (
        <li
        
        data-key={position}
        data-id={id}
        onClick={()=> {
          handleReorder(id)
        }}
        className={styles.draggableItem}>
       <div  className={touched ? styles.itemKey : styles.itemKey_not_clicked}>{touched ? (index+1): 0}</div>
       <div className={styles.itemDesc}>
           <p dangerouslySetInnerHTML={{ __html: text }}></p>
       </div>
   </li>
    )
}

export default SortableItem;
/*
 <div ref={setNodeRef}
             style={style}
             {...attributes}
             {...listeners}
             className={ `${styles.draggableItem} ${ok ? styles.ok : (ko ? styles.ko : '')}` }>
            <div className={styles.itemKey}>{(ok || ko) ? correctOrder : (index + 1)}</div>
            <div className={styles.itemDesc}>
                <p dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
        </div>
         */