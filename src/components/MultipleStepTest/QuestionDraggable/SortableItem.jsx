import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import styles from "./SortableItem.module.scss";

const SortableItem = ({id, ok, ko, index, text, correctOrder})=>{
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
             {...attributes}
             {...listeners}
             className={ `${styles.draggableItem} ${ok ? styles.ok : (ko ? styles.ko : '')}` }>
            <div className={styles.itemKey}>{(ok || ko) ? correctOrder : (index + 1)}</div>
            <div className={styles.itemDesc}>
                <p dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
        </div>
    )
}

export default SortableItem;
