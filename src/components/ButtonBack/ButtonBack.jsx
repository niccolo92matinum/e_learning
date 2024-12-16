import React from 'react';
import styles from './ButtonBack.module.scss';

const ButtonBack = (props)=>{
    return (
        <button onClick={props.onClick} style={props.style} className={
            [styles.ButtonBack,
                props.className,
                props.disabled ? styles.disabled : '',
                props.white ? styles.white : ''
            ].join(' ')}>{props.children}</button>
    )
}

export default ButtonBack;