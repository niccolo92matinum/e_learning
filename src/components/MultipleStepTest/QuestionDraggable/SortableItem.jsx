import {CSS} from '@dnd-kit/utilities';
import styles from "./SortableItem.module.scss";

const SortableItem = (props)=>{

   const {
    id,
    ok,
    ko,
    index,
    text,
    correctOrder,
    handleReorder,
    position,
    touched,
    attemptKo

   } = props

   // stile div singolo elemento
   let styleSingleEl = styles.itemKey
   let styleSingleElTagP = null

   if(touched && !attemptKo){
    styleSingleEl = styles.itemKey
   }else if(!touched && !attemptKo){
    styleSingleEl = styles.itemKey_not_touched
   }else if(attemptKo){
    styleSingleEl = styles.itemKey_not_touched
    styleSingleElTagP = styles.pSingleElement
   }

 

    return (
        <div 
             key={id}
             data-key={position}
             data-id={id}
             onClick={(e) => handleReorder(id)}
             className={ `${styles.draggableItem} ${ok ? styles.ok : (ko ? styles.ko : '')}` }>
            <div className={styleSingleEl}>{(ok || ko) ? correctOrder : <p className={styleSingleElTagP}>{touched ? index + 1 : 0}</p>}</div>
            <div className={styles.itemDesc}>
                <p dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
        </div>
    )
}

export default SortableItem;
