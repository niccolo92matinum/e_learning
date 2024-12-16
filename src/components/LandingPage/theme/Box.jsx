import React from 'react';
import { noop } from '../../../utils';
import styles from "./Box.module.scss";

const Box = (props) => {
    const {cover, locked, onClick, title} = props;

        return (
            <div className={`${styles.box}`} data-animate={ props.anim } onClick={()=>locked ? noop() : onClick()} style={{cursor: `${locked ? "not-allowed" : "pointer"}`,filter:`grayscale(${locked ? "100%" : 0})`, backgroundImage: `url(${cover})`}}>
                <div className={`${styles.title} titolo`}>{title}</div>
            </div>
        )
}

export default Box;