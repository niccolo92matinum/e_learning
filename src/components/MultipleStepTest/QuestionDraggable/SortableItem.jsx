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
    attemptKo,
    solutionVisible

   } = props

   // stile div singolo elemento
   let styleSingleEl = styles.itemKey
   let styleSingleElTagP = null

   if(touched && !attemptKo && !solutionVisible){
    styleSingleEl = styles.itemKey
   }else if(!touched && !attemptKo && !solutionVisible ){
    styleSingleEl = styles.itemKey_not_touched
   }else if(attemptKo && !solutionVisible){
    styleSingleEl = styles.itemKey_not_touched
    styleSingleElTagP = styles.pSingleElement
   }else if(!touched && solutionVisible){
    styleSingleEl = styles.itemKey_not_touched_solution_visible
   }else if(touched && solutionVisible){
    styleSingleEl = styles.itemKey_solution_visible
   }

 

    return (
        <div 
             key={id}
             data-key={position}
             data-id={id}
             onClick={(e) => handleReorder(id)}
             className={ `${styles.draggableItem}` }>
            <div className={styleSingleEl}>
                <p className={styleSingleElTagP}>{(touched || solutionVisible) ? index + 1 : 0}</p>
                </div>
            <div className={styles.itemDesc}>
                <p dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
        </div>
    )
}

export default SortableItem;
