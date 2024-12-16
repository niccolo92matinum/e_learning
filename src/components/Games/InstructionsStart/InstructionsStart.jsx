import styles from "./InstructionsStart.module.scss";
import Button from "../../Button/Button";
import React from "react";

const InstructionsStart = (props)=>{
    return (
        <div className={styles.InstructionsStart}>
            <div className={styles.instructions}>
                {props.children}
            </div>
            <div style={{textAlign: "center", margin: "10px"}}>
                <Button onClick={props.onStartClick}>START</Button>
            </div>
        </div>
    )
}

export default InstructionsStart;
