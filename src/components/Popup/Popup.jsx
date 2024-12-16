import styles from "./Popup.module.scss";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useKeyPressCallback} from "../../utils/useKeyPressCallback";
const Popup = (props) => {

    const KEYCODE_ESC = 27;
    useKeyPressCallback(KEYCODE_ESC, props.onClosePopup);

    return (
        <div tabIndex={0} className={styles.Popup} onBlur={ () => { /*props.onClosePopup()*/} }>
            <div className={styles.header}>
                <span>{props.title}</span>
                <FontAwesomeIcon icon={faTimes} size="lg" className={'clickable'} onClick={()=>{props.onClosePopup()}}/>
            </div>
            <div className={styles.content} dangerouslySetInnerHTML={ {__html: props.text}}></div>
        </div>
    )
}

export default Popup;