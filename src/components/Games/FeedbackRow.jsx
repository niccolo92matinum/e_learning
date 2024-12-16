import styles from "./FeedbackRow.module.scss";
const FeedbackRow = (props)=>{
    return (
        <div className={[styles.FeedbackRow, props.ok ? styles.ok : styles.ko].join(' ')}>
            {props.children}
        </div>
    )
}
export default FeedbackRow;