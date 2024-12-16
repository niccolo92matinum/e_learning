import styles from "./Paragraph.module.scss";

const Paragraph = (props)=>{
    return (
        <div className={styles.Paragraph} dangerouslySetInnerHTML={{__html: props.text}}>
            {/*{props.text}*/}
        </div>
    )
}
export default Paragraph;