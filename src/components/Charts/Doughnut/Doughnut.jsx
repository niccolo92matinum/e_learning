import React, { useRef} from 'react'
import styles from "./Doughnut.module.scss";

const Doughnut = (props) => {
    const {innerLabel, isPercent, percentage, valueShowed} = props;
    const elementRef = useRef();

    return (
        <div className={styles.progressDoughnut}>
            <svg className={styles.progressDoughnut} width="200px" height="200px" version="1.1" xmlns="http://www.w3.org/2000/svg" ref={elementRef}>
                <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor:'rgb(98,148,202)', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'rgb(154,191,224)', stopOpacity:1}} />
                    </linearGradient>
                </defs>

                <circle r="40%" cx="100px" cy="100px" fill="transparent" style={{strokeDasharray: '500', strokeDashoffset: 0}}></circle>
                { percentage && <circle r="40%" cx="100px" cy="100px" fill="transparent" style={{strokeDasharray: '500', strokeDashoffset: (500 - ((500*percentage)/100)), stroke: 'url(#bgGradient)'}}></circle> }                
            </svg>
            <div className={styles.pOverlay}>
                <div className={styles.pValue}>
                    <span className={styles.percent}>{isPercent ? percentage + "%" : valueShowed}</span>
                    <label>{innerLabel}</label>
                </div>
            </div>
        </div>
    )
}

export default Doughnut;
