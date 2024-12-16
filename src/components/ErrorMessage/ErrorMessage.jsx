import styles from "./ErrorMessage.module.scss";
const ErrorMessage = ({message})=>{
    return (
        <div className={styles.ErrorConnectionMessage}>
            <p className={styles.inner} dangerouslySetInnerHTML={{__html: message}}></p>
        </div>
    )
}
export default ErrorMessage;
