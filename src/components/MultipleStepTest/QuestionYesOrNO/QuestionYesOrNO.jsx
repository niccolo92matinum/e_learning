import React, {useEffect, useState} from "react";
import { isNil } from "ramda";
import styles from "./QuestionYesOrNO.module.scss";
import FeedbackText from "../FeedbackText/FeedbackText";
import HeaderQuestion from "../HeaderQuestion/HeaderQuestion";
import { useSelector } from "react-redux";
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
      "ko": "La risposta non è corretta",
      "retry": "Riprova!"
  },
  "type": "exercise_yesorno",
  "title": "<p>Titolo</p>",
  "subtitle": "",
  "score": 1,
  "audioQuestion": "01_01",
  "attempt": 2,
  "questions": [
      "Marrakesh è la capitale del Marocco",
      "Alexander Fleming ha scoperto la penicillina",
      "L'Alaska è il più grande stato d'America in miglia quadrate",
      "Ci sono 5 tipi di gruppo sanguigno"
  ],
  "yes": "Vero",
  "no": "Falso",
  "corrects": [
      1,
      0,
      0,
      1
  ]
}
 */
const QuestionYesOrNO = (props) => {
  const {
    questions,
    attempt,
    prevNextButtons,
    currentQuestionIndex,
    feedback,
    onConfirmed,
    givenAnswers,
    isHideFeedback,
    title,
    subtitle,
    yes,
    no,
    corrects,
    recoveredAttempt,
    percTimer,
    countdownTimer,
    questionsLenght
  } = props;

  const [answeredIndex, setAnsweredIndex] = useState([]);
  const [feedbackText, setFeedbackText] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(recoveredAttempt || 1);

  useRecoverExercises(givenAnswers, setAnsweredIndex);

  const structureData = useSelector((state) => state.structure.data);

  const areAnsweredCorrect = () => {
    return corrects.toString() === answeredIndex.toString();
  };

  const onConfirm = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const okRightAnswer = areAnsweredCorrect();
    // se ho dei tentativi e non li ho bruciati non mostro feedback
    // se ho risposto giusto oppure ho finito i tentativi, posso sbloccare la pagina
    const canConvalidate =
      !attempt || attempt <= currentAttempt || okRightAnswer;
    // setto il tentativo
    onConfirmed(answeredIndex, okRightAnswer, canConvalidate);

      if (!isHideFeedback && (answeredIndex || answeredIndex === 0)) {
        if (feedback) {
            setFeedbackText(areAnsweredCorrect() ? feedback.ok : (!attempt || attempt <= currentAttempt) ? feedback.ko : (feedback.retry || feedbackText.ko));
        }
      }
  };

  const onAnswer = (event, keyCurrent, value) => {
    setAnsweredIndex((prevState) => {
      let clonedAnsweredIndexes = [...prevState];
      clonedAnsweredIndexes[keyCurrent] = value;
      return clonedAnsweredIndexes;
    });
  };

  const buttonConfirm = () => {
    if (props.confirmed || answeredIndex.join("").length !== questions.length) {
      return <div style={{ minHeight: "37px" }}></div>;
    }
    return (
      <input
        className={`btnConfirm`}
        type="submit"
        value={structureData.confirm ?? "-confirm-"}
        onClick={onConfirm}
        disabled={isNil(answeredIndex)}
      />
    );
  };

  const retryHandler = () => {
    setAnsweredIndex([]);
    props.onRetry();
    setFeedbackText('');
    setCurrentAttempt((currentAttempt) => currentAttempt + 1);
  };

  const buttonRetry = () => {
    return props.confirmed &&
      attempt &&
      attempt > currentAttempt &&
      !areAnsweredCorrect() ? (
      <input
        className={"btnConfirm secondary"}
        type="submit"
        value={structureData.retry ?? "-retry-"}
        onClick={retryHandler}
      />
    ) : (
      <div style={{ minHeight: "37px" }}></div>
    );
  };
  // FIXME: controlled/uncontrolled component
  return (
    <div className={"Question question-yes-no"}>
      { !isNil(countdownTimer) && (countdownTimer > 0) && <CountdownLine timer={timer} perc={percTimer}/>}
      <HeaderQuestion
        currentQuestionIndex={currentQuestionIndex}
        title={title}
        subtitle={subtitle}
        questionsLenght={questionsLenght}
      />
      <form>
        {questions &&
          questions.length &&
          questions.map((question, index) => {
            return (
              <div className={["answerRow", styles.row].join(" ")} key={index}>
                <div dangerouslySetInnerHTML={{ __html: question }}></div>
                <div>
                  <input
                    disabled={props.confirmed}
                    className={
                        !isHideFeedback && (!attempt || attempt <= currentAttempt || areAnsweredCorrect()) &&
                      props.confirmed &&
                      corrects[index].toString() === "0"
                        ? "correct"
                        : !isHideFeedback && props.confirmed &&
                          (!attempt || attempt <= currentAttempt)
                        ? "wrong"
                        : ""
                    }
                    onChange={(event) => onAnswer(event, index, 0)}
                    checked={
                      ((answeredIndex &&
                        parseInt(answeredIndex[index]) === 0) ||
                        (givenAnswers &&
                          parseInt(givenAnswers[index]) === 0)) ??
                      false
                    }
                    name={"singleChoice_" + index}
                    type="radio"
                    id={"singleChoice_" + index + "yes"}
                  />
                  <label
                    htmlFor={"singleChoice_" + index + "yes"}
                    className={
                        !isHideFeedback && (!attempt ||
                        attempt <= currentAttempt ||
                        areAnsweredCorrect()) &&
                      props.confirmed &&
                      corrects[index].toString() === "0"
                        ? "correctAnswer"
                        : ""
                    }
                  >
                    <span className={"check-icon"}>
                      <span className={"check-icon-fill"} />
                    </span>
                    <span>{yes} </span>
                  </label>
                  &nbsp;&nbsp;&nbsp;
                  <input
                    disabled={props.confirmed}
                    className={
                        !isHideFeedback && (!attempt ||
                        attempt <= currentAttempt ||
                        areAnsweredCorrect()) &&
                      props.confirmed &&
                      corrects[index].toString() === "1"
                        ? "correct"
                        : !isHideFeedback && props.confirmed &&
                          (!attempt || attempt <= currentAttempt)
                        ? "wrong"
                        : ""
                    }
                    onChange={(event) => onAnswer(event, index, 1)}
                    checked={
                      ((answeredIndex &&
                        parseInt(answeredIndex[index]) === 1) ||
                        (givenAnswers &&
                          parseInt(givenAnswers[index]) === 1)) ??
                      false
                    }
                    name={"singleChoice_" + index}
                    type="radio"
                    id={"singleChoice_" + index + "no"}
                  />
                  <label
                    htmlFor={"singleChoice_" + index + "no"}
                    className={
                        !isHideFeedback && (!attempt ||
                        attempt <= currentAttempt ||
                        areAnsweredCorrect()) &&
                      props.confirmed &&
                      corrects[index].toString() === "1"
                        ? "correctAnswer"
                        : ""
                    }
                  >
                    <span className={"check-icon"}>
                      <span className={"check-icon-fill"} />
                    </span>
                    <span>{no} </span>
                  </label>
                </div>
              </div>
            );
          })}
      </form>
      {feedbackText && (
        <FeedbackText
          isCorrect={areAnsweredCorrect()}
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
      {prevNextButtons}
    </div>
  );
};

export default QuestionYesOrNO;
