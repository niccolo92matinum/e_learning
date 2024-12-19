import React, { useRef, useState } from "react";
import HeaderQuestion from "../HeaderQuestion/HeaderQuestion";
import FeedbackText from "../FeedbackText/FeedbackText";
import { useSelector } from "react-redux";
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
  "type": "exercise_multiple",
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
          "text": "Testo risposta 2",
          "correct": true
      },
      {
          "text": "Testo risposta 3"
      }
  ]
}
 */
const QuestionMultiple = (props) => {
  const {
    answers,
    attempt,
    confirmOnAnswer,
    prevNextButtons,
    currentQuestionIndex,
    feedback,
    givenAnswers,
    onConfirmed,
    title,
    subtitle,
    isHideFeedback,
    recoveredAttempt,
    percTimer,
    countdownTimer,
    timer,
    solutionVisible,
    questionsLenght
  } = props;
console.log('dentro crocette')
  const [answeredIndexes, setAnsweredIndexes] = useState([]);
  const [feedbackText, setFeedbackText] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(recoveredAttempt || 1);

  const orderedAnswers = useRef(answers);

  const structureData = useSelector((state) => state.structure.data);

  const areAnsweredCorrect = ({answeredIndexes, orderedAnswers})=>{
      if (answeredIndexes.length < 1){
          return false;
      }
      let areAllCorrect = true;
      orderedAnswers?.forEach((answer) => {
          if (
              (answer.correct && (answeredIndexes.indexOf(answer.position) < 0)) ||
              (!answer.correct && (Object.values(answeredIndexes).indexOf(answer.position) >= 0))
          ) {
              areAllCorrect = false;
          }
      });
      return areAllCorrect;
  }

  useRecoverExercises(givenAnswers, setAnsweredIndexes);

  const onConfirm = (indexes) => {
    // se ho dei tentativi e non li ho bruciati non mostro feedback
    // se ho risposto giusto oppure ho finito i tentativi, posso sbloccare la pagina

    const isExerciseCorrect = areAnsweredCorrect({answeredIndexes: indexes, orderedAnswers: orderedAnswers.current});
    const canConvalidate =
      !attempt || attempt <= currentAttempt || isExerciseCorrect;
    // setto il tentativo
    onConfirmed(indexes, isExerciseCorrect, canConvalidate);
      if (indexes && indexes.length > 0) {
        if (!isHideFeedback) {
            setFeedbackText(isExerciseCorrect ? feedback.ok : (!attempt || attempt <= currentAttempt) ? feedback.ko : (feedback.retry || feedbackText.ko));
        }
      }
  };

  const onAnswer = (event, position) => {
      let clonedAnsweredIndexes = [...answeredIndexes];
      if (answeredIndexes.indexOf(position) < 0){
          clonedAnsweredIndexes.push(position);
      }else{
          clonedAnsweredIndexes.splice(answeredIndexes.indexOf(position), 1);
      }
      const isExerciseCorrect = areAnsweredCorrect({answeredIndexes, orderedAnswers: orderedAnswers.current});
      (confirmOnAnswer && !solutionVisible) ? onConfirm(clonedAnsweredIndexes,isExerciseCorrect) : setAnsweredIndexes(clonedAnsweredIndexes);
  };

  const buttonConfirm = () => {
    return !props.confirmed && !confirmOnAnswer ? (
      <input
        className={"btnConfirm"}
        type="submit"
        value={structureData.confirm}
        onClick={()=>onConfirm(answeredIndexes)}
      />
    ) : (
      <div></div>
    );
  };
  const retryHandler = () => {
    let emptyArr = new Array(orderedAnswers.current.length).fill(false);
    setAnsweredIndexes(emptyArr);
    setFeedbackText('');
    setCurrentAttempt((currentAttempt) => currentAttempt + 1);
    props.onRetry();
  };

  const buttonRetry = () => {
    return props.confirmed &&
      attempt &&
      attempt > currentAttempt &&
      !areAnsweredCorrect({answeredIndexes, orderedAnswers: orderedAnswers.current}) ? (
      <input
        className={"btnConfirm secondary"}
        type="submit"
        value={structureData.retry}
        onClick={retryHandler}
      />
    ) : (
      <div></div>
    );
  };
  return (
    <div className={"Question question-multiple"}>
      { !isNil(countdownTimer) && (countdownTimer > 0) &&  <CountdownLine timer={timer} perc={percTimer}/>}
      <HeaderQuestion
        currentQuestionIndex={currentQuestionIndex}
        title={title}
        subtitle={subtitle}
        questionsLenght={questionsLenght}
      />
      {orderedAnswers?.current &&
        orderedAnswers?.current.length &&
        orderedAnswers?.current.map((answer) => {
          return (
            <p className={"answerRow"} key={"multipleChoice_" + answer.position}>
              <input
                disabled={solutionVisible}
                className={
                    ((areAnsweredCorrect({answeredIndexes, orderedAnswers: orderedAnswers.current}) || (!attempt || attempt <= currentAttempt)) && !isHideFeedback && props.confirmed) || solutionVisible ?
                    (answer.correct ? 'correct' : 'wrong') : ''
                }
                onChange={(event) => onAnswer(event, answer.position)}
                checked={answeredIndexes.indexOf(answer.position) >= 0}
                name={"multipleChoice_" + answer.position}
                type="checkbox"
                id={"multipleChoice_" + answer.position}
              />
              <label
                htmlFor={"multipleChoice_" + answer.position}
                className={
                    ((!isHideFeedback &&
                  props.confirmed && (!attempt || attempt <= currentAttempt)) || solutionVisible) &&
                  answer.correct
                    ? "correctAnswer"
                    : ""
                }
              >
                <span className={"check-icon"}>
                  <span className={"check-icon-fill"} />
                </span>
                <span dangerouslySetInnerHTML={{ __html: answer.text }} />
              </label>
            </p>
          );
        })}

      {feedbackText && (
        <FeedbackText
          isCorrect={areAnsweredCorrect({answeredIndexes, orderedAnswers: orderedAnswers.current})}
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

export default QuestionMultiple;
