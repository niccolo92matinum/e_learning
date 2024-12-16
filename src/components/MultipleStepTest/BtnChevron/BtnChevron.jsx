import styles from "../MultipleStepTest.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import log from "loglevel";
import {Button} from "../../Button/Button.jsx";

const BtnChevron = (props)=>{
    return (
        <Button
            className={styles.btnRight} onClick={props.onClickHandler}
        >
            {props.isBack && <FontAwesomeIcon icon={faChevronLeft}/>}
            <span>{props.children}</span>
            {!props.isBack && <FontAwesomeIcon icon={faChevronRight}/>}
        </Button>
    )
}

export default BtnChevron;
