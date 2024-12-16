import React from 'react'
import styles from "./Spinner.module.scss";

const Spinner = () => {
    return (        
        <div className={styles.spinWrapper}>
            <div className={styles.spinner}>
            </div>
        </div>    
    )
}

export default Spinner
