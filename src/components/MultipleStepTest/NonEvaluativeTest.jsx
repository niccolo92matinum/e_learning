import styles from "./MultipleStepTest.module.scss";
import "./Question.scss";
import {useMemo, useReducer} from "react";
import ExerciseBgContainer from "./ExerciseBgContainer/ExerciseBgContainer.jsx";
import useAudioExercise from "../../utils/useAudioExercise.js";
import Sound from "react-sound";
import getComponentById from "../../utils/getComponentById.js";


const exercisesReducer = (state, action) => {
    switch (action.type) {
        case "QUESTION_CONFIRMED":
            return {
                ...state,
                givenAnswers: action.payload.answeredIndexes,
                viewed: action.payload.viewed,
                confirmed: true,
                correct: action.payload.correct,
                attemptCount: state.attemptCount + 1
            };
        case "RESET_TEST":
            return {
                ...state,
                currentQuestionIndex: 0,
                givenAnswers: null,
                confirmed: false,
                correct: null,
                attemptCount: 0
            };
        case "QUESTION_RETRY":
            return {
                ...state,
                givenAnswers: null,
                confirmed: false,
                correct: null
            };
        default:
            return {...state};
    }
};

const createInitialState = (args)=>{
    return {
        givenAnswers: null,
        viewed: false,
        confirmed: false,
        correct: false, // used for exercise audio
        attemptCount: 0,
        exercise: args.exercise
    }
}

/**
 * Traccia solo il viewed della pagina, non punteggi o soglie.
 * Contiene solo un'esercitazione (non più step).
 * Non ha schermate di benvenuto o profilo finale.
 * @param props
 *
 * @returns {JSX.Element}
 * @constructor
 */
const NonEvaluativeTest = (props) => {

    const initialExerciseState = useMemo(()=> {
        let exercise;
        if (!props?.test?.exercise.answers){
            exercise = props?.test?.exercise;
        }else{
            exercise = {...props?.test.exercise, answers: props?.test?.exercise.answers.map((a,i) => {
                    return {
                        ...a,
                        position: i
                    }})}
        }

        return {
            exercise: exercise,
            totalAttempt: props?.test?.attempt,
            shuffleAnswers: props?.test.shuffleAnswers
        }
    },[]);

    const [exercisesState, dispatchExercises] = useReducer(exercisesReducer, initialExerciseState, createInitialState);

    const onQuestionConfirmed = (_answeredIndexes, _correct, _canViewPage) => {
        dispatchExercises({
            type: "QUESTION_CONFIRMED",
            payload: {
                answeredIndexes: _answeredIndexes,
                correct: _correct,
                viewed: _canViewPage,
            },
        });
        _canViewPage && props.onTrackViewedComponent({finalTestStatus: null});
    };

    const onRetry = () => {
        dispatchExercises({
            type: "QUESTION_RETRY",
        });
    };


    const [audioPlayStatus, audioSrc, stopAudioHandler, volume] = useAudioExercise(
        false,
        exercisesState?.viewed,
        exercisesState?.confirmed,
        exercisesState?.correct,
        exercisesState?.exercise,
        props.test.isHideFeedback,
        props.currentLang,
        props.muted
    );

    let Exercise = getComponentById(exercisesState?.exercise.type);
    const renderEl = <Exercise {...exercisesState?.exercise}
                               onConfirmed={onQuestionConfirmed}
                               onRetry={onRetry}
                               confirmOnAnswer={props.test.confirmOnAnswer}
                               currentQuestionIndex={exercisesState?.currentQuestionIndex}
                               key={"exercise_" + exercisesState?.currentQuestionIndex}
                               givenAnswers={exercisesState?.givenAnswers}
                               confirmed={exercisesState?.confirmed}
                               recoveredAttempt={exercisesState?.attemptCount}
                               isHideFeedback={props.test.isHideFeedback}
                               hasButtonSolution={true}
                            />

    return <div className={styles.ExerciseSingle}><ExerciseBgContainer>{renderEl}{exercisesState?.exercise?.audioQuestion && audioSrc && (
        <Sound playStatus={audioPlayStatus} url={audioSrc} onFinishedPlaying={stopAudioHandler} volume={volume} />
    )}</ExerciseBgContainer></div>;
};

export default NonEvaluativeTest;
