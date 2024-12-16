import React, {useLayoutEffect, useRef, useState} from 'react';
import { noop } from '../../../utils';
import styles from "./FirstLevel.module.scss";
import Transition from "react-transition-group/Transition";
import gsap from "gsap";

const FirstLevelTheme = (props) => {
    const {cover, locked, onClick, title} = props;

        return (
            <div className={`${styles.firstBlock} first-block`}  onClick={()=>locked ? noop() : onClick()} style={{cursor: `${locked ? "not-allowed" : "pointer"}`,filter:`grayscale(${locked ? "100%" : 0})`, backgroundImage: `url(${cover})`}}>
                <div className={`${styles.title} titolo`} data-animate={ props.anim }>{title}</div>
            </div>
        )
}

export default FirstLevelTheme;