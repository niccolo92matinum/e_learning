import styles from "./ScoreView.module.scss";
import React, {useEffect, useState} from "react";
import { withScorm } from "../../../utils/react-scorm-provider";
import quizIcon from "../../../assets/images/quiz-logo.png";
import log from "loglevel";
import LoadingIcon from "../../LoadingIcon/LoadingIcon";
import scormDataModel from "../../../utils/scormDataModel";
import {getScormVersion} from "../../../lmsUtils/lms";
const ScoreView = (props)=>{

    const [bonus, setBonus] = useState(0);
    const [extraBonus, setExtraBonus] = useState(0);
    const [score, setScore] = useState(0);
    const [completionMessage, setCompletionMessage] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        !props.pointsCorrectAnswer && log.error("ScoreView: pointsCorrectAnswer is required!");
        !(props.correctCount || (props.correctCount === 0)) && log.error("ScoreView: correctCount is required! received: ", props.correctCount);
        !((props.isPassed === true) || (props.isPassed === false)) && log.error("ScoreView: isPassed is required!", props.isPassed);
        !props.questionsCount && log.error("ScoreView: questionsCount is required!");
        !((props.timeOver === true) || (props.timeOver === false)) && log.error("ScoreView: timeOver is required!", props.timeOver);
    },[props])


    const BONUS_POINTS = 100;
    const EXTRA_BONUS_POINTS = 100;

    useEffect(()=>{
        log.info("props.halfTimeElapsed",props.halfTimeElapsed)
        const bonus = Math.round(props.correctCount === props.questionsCount ? BONUS_POINTS : 0);
        const extraBonus = ((!props.halfTimeElapsed && bonus) ? EXTRA_BONUS_POINTS : 0);
        setExtraBonus(extraBonus);
        setBonus(bonus);
        const score = props.pointsCorrectAnswer * props.correctCount;
        setScore(score);
        const calculatedScore = Math.round(score + bonus + extraBonus);
        const maxScore = (props.questionsCount*props.pointsCorrectAnswer) + BONUS_POINTS + EXTRA_BONUS_POINTS;
        const scorePerc = (calculatedScore * 100 / maxScore).toFixed(2);
        props.sco.set(scormDataModel[getScormVersion(props.sco)].lesson_location, scorePerc);
        props.sco.set("cmi.suspend_data", "S"+score+"|B"+bonus+"|X"+extraBonus+"|TOTAL"+calculatedScore) // suspend_data: S50|B100|X100|TOTAL250
        props.sco.setStatus("completed");

        const percCorrectAnswers = score * 100 / (props.questionsCount*props.pointsCorrectAnswer)
        if (props.timeOver){
            setCompletionMessage("Oh no, you failed!");
        }else if (percCorrectAnswers < 50){
            setCompletionMessage("Game Over");
        }else{
            setCompletionMessage("Congratulations!");
        }
        setLoaded(true);
    },[])
    return (
        <div className={styles.ScoreView}>
            <div style={{overflow: "auto"}}>
                <img src={props.icon || quizIcon} className={styles.icon} alt=""/>
                <h2>{props.title}</h2>
                <p className={styles.completionMessage}>{completionMessage}</p>
                {loaded ? <>
                    <p className={styles.infoMessage}>{props.timeOver ? "Time is over" : "You have just earned"}</p>
                <p className={styles.score}>{score} points</p>
                <p className={styles.infoMessage}>{props.correctCount}/{props.questionsCount} correct answers</p>

                    {!!bonus && <div>
                        <p className={styles.completionMessage}>Bonus points</p>
                    <p className={styles.score} style={{color: "#5f646d"}}>{bonus}</p>
                    </div>}
                    {!!extraBonus && <div>
                        <p className={styles.completionMessage}>Extra Bonus Time</p>
                    <p className={styles.score} style={{color: "#5f646d"}}>{extraBonus}</p>
                    </div>}

                    {props.details && <><p className={styles.detailHeader}>
                        DETAILS
                    </p>
                        <div className={styles.rowDetail}>
                            <span className={styles.label}>PERU</span>
                            <span className={styles.points}>{props.details[0] * props.pointsCorrectAnswer} points</span>
                        </div>
                        <div className={styles.rowDetail}>
                            <span className={styles.label}>MONGOLIA</span>
                            <span className={styles.points}>{props.details[1] * props.pointsCorrectAnswer} points</span>
                        </div>
                        <div className={styles.rowDetail}>
                            <span className={styles.label}>NEW ZEALAND</span>
                            <span className={styles.points}>{props.details[2] * props.pointsCorrectAnswer} points</span>
                        </div>
                        <div className={styles.rowDetail}>
                            <span className={styles.label}>AUSTRALIA</span>
                            <span className={styles.points}>{props.details[3] * props.pointsCorrectAnswer} points</span>
                        </div>
                    </>}
                </> : <LoadingIcon/>}
            </div>



            {/*<Button>CLOSE AND GO BACK</Button>*/}
        </div>
    )
}
export default withScorm()(ScoreView);
