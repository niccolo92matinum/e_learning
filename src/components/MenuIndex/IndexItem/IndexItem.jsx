import styles from "./IndexItem.module.scss";
import {faLock} from "@fortawesome/free-solid-svg-icons/faLock";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons/faCheckCircle";
const IndexItem = (props) => {
    return (
        <button className={`${styles.pageTitle} ${props.locked ? styles.restricted : ''} ${props.active ? styles.active : ''} ${props.viewed ? styles.viewed : ''}`} onClick={props.onClick} disabled={props.locked || !props.visible}>
            <span className={styles.indexPage}>{props.index}</span>
            <span className={styles.titlePage}>{props.title}</span> {props.locked && <FontAwesomeIcon icon={faLock}/>} {props.viewed && <FontAwesomeIcon icon={faCheckCircle}/>} {props.active && 'Act'}
        </button>
    )
}

export default IndexItem;