import styles from "./SaveProgress.module.scss";
import {useState} from "react";
const SaveProgress = (props)=>{
    const [saved, setSaved] = useState(false);

    const closeScormAPIConnection = ()=>{
        // TODO: props.sco.close();
        setSaved(true);
    }

    return (
        <>
            <div className={styles.SaveProgress}>
                <p>Clicca sul pulsante chiudi per salvare i tuoi progressi.</p>
                <button onClick={closeScormAPIConnection}>Salva</button>
            </div>
            {saved && <div className={styles.SavedProgressMessage}>
                <p>Progressi salvati. Puoi chiudere il corso.</p>
            </div>}
        </>
    )
}

export default SaveProgress;
