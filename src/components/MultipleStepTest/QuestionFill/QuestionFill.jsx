import React, {useCallback, useEffect, useState} from "react";
import HeaderQuestion from "../HeaderQuestion/HeaderQuestion";
import FeedbackText from "../FeedbackText/FeedbackText";
import styles from "./QuestionFill.module.scss";
import Droppable from "./Droppable";
import Draggable from "./Draggable";
import { useSelector } from "react-redux";
import reactStringReplace from "react-string-replace";
import {useRecoverExercises} from "../../../utils/useRecoverExercisesState.js";
import CountdownLine from "../CountdownLine/CountdownLine.jsx";
import {isNil} from "ramda";

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
   "type": "exercise_fillDnD",
   "title": "<p>Titolo formattato</p>",
   "subtitle": "",
   "score": 0,
   "attempt": 2,
   "audioQuestion": "01_01",
   "sentence": "Ciao io sono {droppable}, ho {droppable}",
   "words": [
       "Marco",
       "Luigi",
       "Mario",
       "40",
       "20",
       "30"
   ],
   "answers": [
       0,3
   ]
 }
 */
const QuestionFill = (props) => {
  const {
    sentence,
    attempt,
    words,
    answers,
    feedback,
    prevNextButtons,
    givenAnswers,
    currentQuestionIndex,
    onConfirmed,
    title,
    subtitle,
    isHideFeedback,
    recoveredAttempt,
    hasButtonSolution,
    percTimer,
    countdownTimer,
    questionsLenght
  } = props;
  const [answeredIndexes, setAnsweredIndexes] = useState([]);
  const [feedbackText, setFeedbackText] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(recoveredAttempt || 1);

  const structureData = useSelector((state) => state.structure.data);

  useRecoverExercises(givenAnswers, setAnsweredIndexes);

  const onDropHandler = (position, text) => {
    setAnsweredIndexes((answeredIndexes) => {
      let resAnswered = [...answeredIndexes];
      //let oldPosition = Object.keys(answeredIndexes).find(pos => answeredIndexes[pos] === text);
      let oldPosition = answeredIndexes.findIndex((el) => el === text);
      if (oldPosition > 0 && oldPosition !== position) {
        // elimino l'elemento nella vecchia posizione
        resAnswered = [
          [...resAnswered.slice(0, oldPosition)],
          [...resAnswered.slice(oldPosition + 1, resAnswered.length)],
        ];
      }
      resAnswered[position] = text;
      return resAnswered;
    });
  };

  const areAllAnswered = useCallback(() => {
    return answers.length === answeredIndexes.length;
  }, [answeredIndexes, answers]);

  const renderSentenceFunc = () => {
    let count = -1;
    let renderedArray = reactStringReplace(
      sentence,
      "{droppable}",
      (match, i) => {
        count++;
        return (
          <Droppable
            key={i}
            position={count}
            onDrop={onDropHandler}
            text={answeredIndexes[count]}
            confirmed={props.confirmed}
          />
        );
      }
    );
    return renderedArray;
  };

  const areAnsweredCorrect = () => {
    let correct = true;
    for (let i = 0; i < answers.length; i++) {
      if (words[answers[i]] !== answeredIndexes[i]) {
        correct = false;
      }
    }
    return correct;
  };

  const onConfirm = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const correct = areAnsweredCorrect();
    // se ho dei tentativi e non li ho bruciati non mostro feedback
    // se ho risposto giusto oppure ho finito i tentativi, posso sbloccare la pagina
    const canConvalidate =
      !attempt || attempt <= currentAttempt || correct;
    if (feedback && !isHideFeedback) {
        setFeedbackText(areAnsweredCorrect() ? feedback.ok : (!attempt || attempt <= currentAttempt) ? feedback.ko : (feedback.retry || feedback.ko));
    }
    onConfirmed(answeredIndexes, correct, canConvalidate);
  };

  const buttonConfirm = () => {
    return areAllAnswered() && !props.confirmed ? (
      <input
        className={"btnConfirm"}
        type="submit"
        value={structureData.confirm}
        onClick={onConfirm}
        disabled={answeredIndexes.length === 0}
      />
    ) : (
      <div></div>
    );
  };

  const retry = () => {
    setAnsweredIndexes([]);
    setCurrentAttempt((currentAttempt) => currentAttempt + 1);
    props.onRetry();
    setFeedbackText(null);
  };

  const solution = () => {
    const correctAnswers=answers.map((element) => words[element])
    setAnsweredIndexes(correctAnswers);
    //props.onRetry();
    //setFeedbackText(null);
  };

  const buttonSolution = () => {
    return props.confirmed &&
      attempt &&
      attempt <= currentAttempt &&
      !areAnsweredCorrect() ? (
      <input
        className={"btnConfirm"}
        type="submit"
        value={structureData.solution}
        onClick={() => solution()}
        disabled={answeredIndexes.length === 0}
      />
    ) : (
      <div></div>
    );
  };

  const buttonRetry = () => {
    return props.confirmed &&
      attempt &&
      attempt > currentAttempt &&
      !areAnsweredCorrect() ? (
      <input
        className={"btnConfirm secondary"}
        type="submit"
        value={structureData.retry}
        onClick={() => retry()}
        disabled={answeredIndexes.length === 0}
      />
    ) : (
      <div></div>
    );
  };

  return (
    <div className={"Question"}>
      { !isNil(countdownTimer) && (countdownTimer > 0) &&  <CountdownLine timer={timer} perc={percTimer}/>}
      <HeaderQuestion
        currentQuestionIndex={currentQuestionIndex}
        title={title}
        subtitle={subtitle}
        questionsLenght={questionsLenght}
      />
      <div className={styles.toolbox}>
        {words.map(
          (word, keyW) =>
            answeredIndexes.indexOf(word) < 0 && (
              <Draggable confirmed={props.confirmed} text={word} key={keyW} dragIndex={keyW} />
            )
        )}
      </div>
      {/*{(!isHideFeedback && (props.confirmed && isCorrect) && (isCorrect || !attempt || attempt <= currentAttempt) ? styles.correct : !isHideFeedback && props.confirmed && (!attempt || attempt <= currentAttempt) ? styles.wrong : "")}*/}
      <div className={styles.dropArea}>
        <div>{renderSentenceFunc()}</div>
      </div>
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
        {hasButtonSolution && buttonSolution()}
      </div>
      {prevNextButtons}
    </div>
  );
};

export default QuestionFill;
