import React from 'react';
import { noop } from '../../../utils';
import styles from "./SecondLevel.module.scss";

const SecondLevelTheme = (props) => {
        const {cover, isActive, onClick, title} = props;
        
        return (            
            <div className={styles.secondBlock} onClick={()=>isActive ? onClick() : noop()} style={{cursor: `${isActive ? "pointer" : "not-allowed"}`,filter:`grayscale(${isActive ? 0 : "100%"})`, backgroundImage: `url(${cover})`}}>
                <div className={styles.title}>{title}</div>
            </div>
        )
}

export default SecondLevelTheme;