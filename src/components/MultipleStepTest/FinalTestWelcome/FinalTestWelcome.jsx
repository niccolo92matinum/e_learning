import React from 'react'
import styles from "./FinalTestWelcome.module.scss";
import {useSelector} from "react-redux";
import {Button} from "../../Button/Button.jsx";
import ExerciseBgContainer from "../ExerciseBgContainer/ExerciseBgContainer.jsx";

const FinalTestWelcome = (props) => {
    const {exercisesLength, title, maxScore, masterScore, onStartTest, timer} = props;
    const structureData = useSelector((state) => state.structure.data);

    const correctCount = Math.floor(masterScore*exercisesLength/100);
    const formatTimer = (timer)=> {
        if (!timer){
            return null;
        }
        const minutes = Math.round(timer/60);
        if (minutes > 0) {
            return <p>Hai a disposizione <strong>{minutes} {minutes === 1 ? 'minuto' : 'minuti'}</strong> per completarlo.</p>
        }else{
            return <p>Hai a disposizione <strong>{timer} {timer === 1 ? 'secondo' : 'secondi'}</strong> per completarlo.</p>
        }
    }
    return (
        <ExerciseBgContainer>
            <div className={styles.welcome}>
            <h3>{title}</h3>
                <br />
                <div style={{textAlign: "left"}}>
                    <h1>{structureData.welcomeTest}</h1>
                    <p>Il test è composto da <strong>{exercisesLength}</strong> {exercisesLength === 1 ? 'domanda' : 'domande'}.</p>
                    {formatTimer(timer)}
                    {masterScore && (masterScore > 0) ? <p>Per superarlo dovrai rispondere correttamente ad almeno <strong>{correctCount}</strong> {correctCount === 1 ? 'domanda' : 'domande'}.</p> : null}
                </div>

                <Button onClick={() => {onStartTest()}}>{structureData.start}</Button>
            </div>
        </ExerciseBgContainer>
    ) 
}

export default FinalTestWelcome
