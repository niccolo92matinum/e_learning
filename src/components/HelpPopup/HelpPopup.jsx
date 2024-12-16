import styles from "./HelpPopup.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const HelpPopup = (props) => {
  return (
    <div className={styles.HelpPopup} onClick={props.onClosePopup}>
      <div
        className={styles.content}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.closeIcon} onClick={props.onClosePopup}>
          <FontAwesomeIcon icon={faXmark} size={"lg"}></FontAwesomeIcon>
        </div>
        <h2>Navigation Controls</h2>
        <div className={styles.helpRow}>
          <div className={styles.icons}></div>
          <p>
            <strong>Audio button:</strong> it allows you to turn the audio
            on/off
          </p>
        </div>
        <div className={styles.helpRow}>
          <div className={styles.icons}></div>
          <p>
            <strong>Play/Pause button:</strong> it allows you to start/stop the
            page
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;
