import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import styles from "./SortableItem.module.scss";

const SortableItem = ({id, ok, ko, index, text, correctOrder,handleReorder,position,touched})=>{
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable( {id: id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef}
             style={style}
             key={id}
             data-key={position}
             data-id={id}
             onClick={(e) => handleReorder(id)}
             className={ `${styles.draggableItem} ${ok ? styles.ok : (ko ? styles.ko : '')}` }>
            <div className={`${touched ? styles.itemKey: styles.itemKey_not_touched}`}>{(ok || ko) ? correctOrder : `${touched ? index + 1 : 0}`}</div>
            <div className={styles.itemDesc}>
                <p style={{fontSize:'30px'}} dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
        </div>
    )
}

export default SortableItem;
