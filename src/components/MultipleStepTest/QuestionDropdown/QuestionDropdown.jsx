import React, { useCallback, useEffect, useState } from "react";
import { isNil } from "ramda";
import styles from "./QuestionDropdown.module.scss";
import log from "loglevel";
import FeedbackText from "../FeedbackText/FeedbackText";
import HeaderQuestion from "../HeaderQuestion/HeaderQuestion";
import Dropdown from "../Dropdown/Dropdown";
import { useSelector } from "react-redux";
import {useRecoverExercises} from "../../../utils/useRecoverExercisesState.js";
import CountdownLine from "../CountdownLine/CountdownLine.jsx";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 *
 * props.type: viene usato per selezionare l'esercitazione (exercise_dropdown)
 * props.mutuallyExclusive se true le option si possono selezionare solo una volta in tutte le dropdown
 * props.image indica l'immagine da mostrare insieme alle dropdown (es. ./assets/images/exercises/00_02.jpg)
 *
 *
 * Esempio:
 {
  "feedback": {
      "ok": "La risposta è corretta",
      "ko": "La risposta non è corretta",
      "retry": "Riprova!"
  },
  "type": "exercise_dropdown",
  "title": "Titolo ",
  "subtitle": "Sottotitolo",
  "score": 1,
  "attempt": 2,
   "audioQuestion": "01_01",
  "image": "./assets/images/exercises/00_02.jpg",
  "mutuallyExclusive": false,
  "answers": [
      {
          "text": "A.",
          "correctOptionIndex": 0
      },
      {
          "text": "B.",
          "correctOptionIndex": 1
      },
      {
          "text": "C.",
          "correctOptionIndex": 2
      }
  ],
  "options": [
      {
          "text": "option1"
      },
      {
          "text": "option2"
      },
      {
          "text": "option3"
      }
  ]
}
 */

const QuestionDropdown = (props) => {
  const {
    answers,
    options,
    prevNextButtons,
    confirmOnAnswer,
    currentQuestionIndex,
    feedback,
    givenAnswers,
    onConfirmed,
    title,
    subtitle,
    attempt,
    image,
    isHideFeedback,
    mutuallyExclusive,
    recoveredAttempt,
    hasButtonSolution,
    percTimer,
    countdownTimer,
    timer,
    solutionVisible,
    questionsLenght
  } = props;

  const [openedDropdownIndex, setOpenedDropdownIndex] = useState(null);
  const [answeredIndex, setAnsweredIndex] = useState({});
  const [currentAttempt, setCurrentAttempt] = useState(recoveredAttempt || 1);
  const [feedbackText, setFeedbackText] = useState(null);

  useRecoverExercises(givenAnswers, setAnsweredIndex);

  const structureData = useSelector((state) => state.structure.data);

  const areAllAnswered = useCallback(() => {
    return Object.keys(answeredIndex).length === options.length;
  }, [answeredIndex, options]);

  /** gestione dell'onClick */
  useEffect(() => {
    if (confirmOnAnswer && areAllAnswered() && !solutionVisible) {
      onConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answeredIndex, confirmOnAnswer, areAllAnswered]);

  const areAnsweredCorrect = () => {
    const isCorrectThis = !answers.find((a, index) => {
      return answeredIndex[index] !== a.correctOptionIndex;
    });
    return isCorrectThis;
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

    onConfirmed(answeredIndex, okRightAnswer, canConvalidate);
      if (!isHideFeedback) {
        if (feedback) {
          setFeedbackText(areAnsweredCorrect() ? feedback.ok : (!attempt || attempt <= currentAttempt) ? feedback.ko : (feedback.retry || feedbackText.ko));
        }
      }
  };

  const onAnswer = (_indexAnswer, _indexOption) => {
    log.info(`clicked answer ${_indexAnswer}`);
    if (
      (mutuallyExclusive && isSelectedOption(_indexOption)) ||
      props.confirmed
    ) {
      return;
    }

    setAnsweredIndex((answeredIndex) => {
      return { ...answeredIndex, [_indexAnswer]: _indexOption };
    });

    setOpenedDropdownIndex(null);
  };

  const isSelectedOption = (_value) => {
    let result = !!answers.find((a, i) => {
      return answeredIndex[i] === _value;
    });
    return result;
  };

  const onOpenDropdown = (_index) => {
    if (props.confirmed) {
      return;
    }
    // se è già aperto, al click viene chiuso
    if (openedDropdownIndex === _index) {
      setOpenedDropdownIndex(null);
    } else {
      setOpenedDropdownIndex(_index);
    }
  };

  const onRetry = () => {
    setAnsweredIndex({});
    setFeedbackText('');
    setCurrentAttempt((currentAttempt) => currentAttempt + 1);
    props.onRetry();
  };

  const onSolution = () => {
    //ottengo l'array degli indici delle corrette e con lo spread operator diventano 
    //prop di un oggetto {...array}
    setAnsweredIndex({...(answers.map((el, index) => {
      return el.correctOptionIndex;
    }))});
    //props.onRetry(); --> a cosa serve 
  };

  const onCancel = () => {
    setAnsweredIndex({});
  };

  const getAnswerClassState = (answer, indexAnswer) => {
    if (!props.confirmed) {
      return "";
    }
    if (
      !isHideFeedback &&
      areAnsweredCorrect() &&
      answers[indexAnswer].correctOptionIndex === answeredIndex[indexAnswer]
    ) {
      return styles.correct;
    } else if (!isHideFeedback && (!attempt || currentAttempt >= attempt)) {
      return styles.wrong;
    }
  };

  const getAnswerState = (answer, indexAnswer) => {
    if (
        isHideFeedback ||
      !props.confirmed ||
      (!areAnsweredCorrect() && currentAttempt < attempt)
    ) {
      return null;
    }
    if (
      answers[indexAnswer].correctOptionIndex === answeredIndex[indexAnswer]
    ) {
      return true;
    } else if (!attempt || currentAttempt >= attempt) {
      return false;
    }
  };

  const buttonCancel = () => {
    return (
      !props.confirmed &&
      Object.keys(answeredIndex).length >= 1 && (
        <input
          className={`btnConfirm secondary`}
          type="submit"
          value={structureData.cancel}
          onClick={onCancel}
          disabled={isNil(answeredIndex)}
        />
      )
    );
  };
  const buttonConfirm = () => {
    return areAllAnswered() && !props.confirmed && !confirmOnAnswer ? (
      <input
        className={`btnConfirm`}
        type="submit"
        value={structureData.confirm}
        onClick={onConfirm}
        disabled={isNil(answeredIndex)}
      />
    ) : (
      <div></div>
    );
  };

  const buttonSolution = () =>{
    return props.confirmed &&
      attempt &&
      attempt <= currentAttempt &&
      !areAnsweredCorrect() ? (
      <input
        className={`btnConfirm`}
        type="submit"
        value={structureData.solution}
        onClick={() => onSolution()}
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
        className={`btnConfirm secondary`}
        type="submit"
        value={structureData.retry}
        onClick={() => onRetry()}
        disabled={isNil(answeredIndex)}
      />
    ) : (
      <div></div>
    );
  };

  return (
    <div
      className={"Question"}
      onClick={() => {
        setOpenedDropdownIndex(null);
      }}
    >
      { !isNil(countdownTimer) && (countdownTimer > 0) &&  <CountdownLine timer={timer} perc={percTimer}/>}
      <HeaderQuestion
        currentQuestionIndex={currentQuestionIndex}
        title={title}
        subtitle={subtitle}
        questionsLenght={questionsLenght}
      />
      {image && (
        <div style={{ textAlign: "center" }}>
          <img src={image} alt="" style={{ height: "300px" }} />
        </div>
      )}

      <ul
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {answers &&
          answers.length &&
          answers.map((answer, indexAnswer) => {
            return (
              <li
                key={"answer_" + indexAnswer}
                onClick={() => {
                  onOpenDropdown(indexAnswer);
                }}
                className={[
                  styles.select,
                  openedDropdownIndex === indexAnswer ? styles.opened : "",
                  getAnswerClassState(answer, indexAnswer),
                ].join(" ")}
              >
                <span className={"label"}>{answer.text}</span>{" "}
                {/*<select name={"singleChoice"} value={answeredIndex[indexAnswer]} onChange={(event)=>{onAnswer(event, indexAnswer)}}>*/}
                <div className={styles.wrapper}>
                  {props.options && (
                    <Dropdown
                      options={options}
                      onOptionSelected={onAnswer}
                      answeredIndex={answeredIndex}
                      dropdownIndex={indexAnswer}
                      mutuallyExclusive={mutuallyExclusive}
                      correct={getAnswerState(answer, indexAnswer)}
                      defaultValue={structureData.select}
                      active={openedDropdownIndex === indexAnswer}
                    />
                  )}
                </div>
              </li>
            );
          })}
      </ul>

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
        {buttonCancel()}
        {buttonConfirm()} 
        {buttonRetry()}
        {hasButtonSolution && buttonSolution()}
      </div>
      {prevNextButtons}
    </div>
  );
};

export default QuestionDropdown;
