import React, {useEffect, useRef, useState} from "react";
import {isNil} from "ramda";
import FeedbackText from "../FeedbackText/FeedbackText";
import HeaderQuestion from "../HeaderQuestion/HeaderQuestion";
import {useSelector} from "react-redux";
import {useRecoverExercises} from "../../../utils/useRecoverExercisesState.js";
import CountdownLine from "../CountdownLine/CountdownLine.jsx";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 *
 * Esempio:
 {
 "feedback": {
 "ok": "La risposta è corretta",
 "ko": "La risposta non è corretta.",
 "retry": "Riprova!"
 },
 "type": "exercise_single",
 "title": "Titolo",
 "subtitle": "Sottotitolo",
 "score": 0,
 "attempt": 2,
 "audioQuestion": "01_01",
 "answers": [
 {
 "text": "Testo risposta 1",
 "correct": true
 },
 {
 "text": "Testo risposta 2"
 },
 {
 "text": "Testo risposta 3"
 }
 ]
 }
 */
const QuestionSingle = (props) => {
    const {
        answers,
        prevNextButtons,
        confirmOnAnswer,
        currentQuestionIndex,
        feedback,
        givenAnswers,
        isHideFeedback,
        onConfirmed,
        title,
        subtitle,
        attempt,
        recoveredAttempt,
        percTimer,
        countdownTimer,
        timer,
        solutionVisible,
        questionsLenght
    } = props;

    const [answeredIndex, setAnsweredIndex] = useState(null);
    const [feedbackText, setFeedbackText] = useState(null);
    const [currentAttempt, setCurrentAttempt] = useState(recoveredAttempt || 1);

    const orderedAnswers = useRef(answers);

    const structureData = useSelector((state) => state.structure.data);
    useRecoverExercises(Array.isArray(givenAnswers) ? givenAnswers[0] : givenAnswers, setAnsweredIndex);

    const onConfirm = (_answeredIndex) => {
        // se ho dei tentativi e non li ho bruciati non mostro feedback
        // se ho risposto giusto non chiedo di riprovare
        const canConvalidate =
            !attempt || attempt <= currentAttempt || areAnsweredCorrect(_answeredIndex);

        onConfirmed(
            _answeredIndex,
            areAnsweredCorrect(_answeredIndex),
            canConvalidate
        );
        if (isHideFeedback) return;
        if (_answeredIndex || _answeredIndex === 0) {
            if (feedback) {
                setFeedbackText(
                    areAnsweredCorrect(_answeredIndex) ? feedback.ok : (!attempt || attempt <= currentAttempt) ? feedback.ko : (feedback.retry || feedbackText.ko)
                );
            } else {
                setFeedbackText(
                    areAnsweredCorrect(_answeredIndex)
                        ? orderedAnswers.current[_answeredIndex].feedback
                        : orderedAnswers.current[_answeredIndex].feedback
                );
            }
        }
    };

    const areAnsweredCorrect = (_answeredIndex) => {
        let correctIndex = -1;
        orderedAnswers.current.map((answer) => {
            if (answer.correct) {
                correctIndex = answer.position;
            }
            return correctIndex;
        });
        return correctIndex === _answeredIndex;
    };

    const onAnswer = (event, position) => {
        if (confirmOnAnswer && !isNil(position) && !solutionVisible) onConfirm(position);
        setAnsweredIndex(position);
    };

    const buttonConfirm = () => {
        return !isNil(answeredIndex) && !props.confirmed && !confirmOnAnswer ? (
            <input
                className={"btnConfirm"}
                type="submit"
                value={structureData.confirm}
                onClick={() => onConfirm(answeredIndex)}
                disabled={isNil(answeredIndex)}
            />
        ) : (
            <div></div>
        );
    };

    const retryHandler = () => {
        setFeedbackText('');
        setAnsweredIndex(null);
        setCurrentAttempt((attempt) => attempt + 1);
        props.onRetry();
    };

    const buttonRetry = () => {
        return props.confirmed &&
        attempt &&
        attempt > currentAttempt &&
        !areAnsweredCorrect(answeredIndex) ? (
            <input
                className={["btnConfirm", "secondary"].join(" ")}
                type="submit"
                value={structureData.retry}
                onClick={retryHandler}
            />
        ) : (
            <div></div>
        );
    };

    return (
        <div className={"Question question-single"}>
            <>
                { !isNil(countdownTimer) && (countdownTimer > 0) &&  <CountdownLine timer={timer} perc={percTimer}/>}
                <HeaderQuestion
                    currentQuestionIndex={currentQuestionIndex}
                    title={title}
                    subtitle={subtitle}
                    questionsLenght={questionsLenght}
                />
                <form>
                    {orderedAnswers.current &&
                        orderedAnswers.current.length &&
                        orderedAnswers.current.map((answer) => {
                            return (
                                <p className={"answerRow"} key={answer.position}>
                                    <input
                                        disabled={(props.confirmed && !confirmOnAnswer) || solutionVisible}
                                        className={
                                            ((areAnsweredCorrect(answeredIndex) || (!attempt || attempt <= currentAttempt)) && !isHideFeedback && props.confirmed) || solutionVisible ?
                                                (answer.correct ? 'correct' : 'wrong') : ''
                                        }
                                        onChange={(event) => onAnswer(event, answer.position)}
                                        checked={answeredIndex === answer.position}
                                        name={"singleChoice"}
                                        type="radio"
                                        id={"singleChoice_" + answer.position}
                                    />
                                    <label
                                        htmlFor={"singleChoice_" + answer.position}
                                        className={
                                            ((!isHideFeedback &&
                                            props.confirmed && (!attempt ||
                                                    attempt <= currentAttempt ||
                                                    areAnsweredCorrect(answeredIndex))) || solutionVisible) && answer.correct
                                                ? "correctAnswer"
                                                : ""
                                        }
                                    >
                                        <span className={"check-icon"}>
                                          <span className={"check-icon-fill"}/>
                                        </span>
                                        <span dangerouslySetInnerHTML={{__html: answer.text}}/>
                                    </label>
                                </p>
                            );
                        })}
                </form>
                {feedbackText && (
                    <FeedbackText
                        isCorrect={areAnsweredCorrect(answeredIndex)}
                        feedbackText={feedbackText}
                    />
                )}
                <div
                    style={{
                        flex: "1 0 auto",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                    }}
                >
                    {buttonConfirm()}
                    {buttonRetry()}
                </div>
            </>
            {prevNextButtons}
        </div>
    );
};

export default QuestionSingle;
