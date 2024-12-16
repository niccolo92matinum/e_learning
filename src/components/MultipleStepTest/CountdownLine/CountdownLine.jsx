import styles from './CountdownLine.module.scss';
import {msToTime} from "../../../utils/formatTimer.js";

const CountdownLine = ({ perc = 0, timer }) => {
    return (
        <div>
            <p className={styles.text}>{msToTime(timer)}</p>
            <progress className={styles.progressBar} value={perc} max="100" >{perc}%</progress>
        </div>
    );
};

export default CountdownLine;
