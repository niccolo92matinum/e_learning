import styles from "./CrossWordCell.module.scss";
const CrossWordCell = (props)=>{
    return (
        <td className={[styles.CrossWordCell, props.fillable ? styles.fillable : '', props.filled ? styles.filled : ''].join(' ')}>
            {props.value && <div className={[styles.index, props.horizontal ? styles.left : styles.top].join(' ')}>{props.value}</div>}
            <span>{props.letter}</span>
        </td>
    )
}

export default CrossWordCell;