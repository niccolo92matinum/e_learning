import React, { useEffect, useState } from "react";
import { isNil } from "ramda";
import styles from "./QuestionDropdownInline.module.scss";
import HeaderQuestion from "../HeaderQuestion/HeaderQuestion";
import { useSelector } from "react-redux";
import FeedbackText from "../FeedbackText/FeedbackText";
import {useRecoverExercises} from "../../../utils/useRecoverExercisesState.js";
import CountdownLine from "../CountdownLine/CountdownLine.jsx";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 *
 * props.type: viene usato per selezionare l'esercitazione (exercise_dropdown)
 *
 * Esempio:
 {
   "feedback": {
     "ok": "Correct!",
     "ko": "La risposta non è corretta",
     "retry": "Riprova!"
   },
   "type": "exercise_dropdown_inline",
   "title": "It’s your turn: fill in the blank spaces with the correct options!",
   "subtitle": "",
   "score": 1,
   "attempt": 1,
   "audioQuestion": "01_01",
   "sentence": "<p>Personal data is the fuel of [[0]]. To protect people&rsquo;s privacy, it is essential to apply norms that are [[1]] and [[2]] . GDPR has all of these features: it holds&nbsp;[[3]] responsible for the use they make of personal data and raises awareness among [[4]]. Organizations are pushed to conform to it to inspire trust in people.&nbsp;<br />Campari Group adopted&nbsp;[[5]] that guarantee conformity to GDPR and a DPO, an expert of&nbsp;[[6]] whose task is to support the Company in complying to the regulation and raise awareness through training and information activities.</p>",
   "options": [
     {
       "0": "GDPR",
       "1": "digital revolution",
       "2": "traditional business"
     },
     {
       "0": "Flexible",
       "1": "rigid",
       "2": "traditional"
     },
     {
       "0": "State-specific",
       "1": "oriented on business",
       "2": "oriented on people’s rights"
     },
     {
       "0": "Organizations",
       "1": "citizens",
       "2": "Nations"
     },
     {
       "0": "Organizations",
       "1": "citizens",
       "2": "Nations"
     },
     {
       "0": "A computer system",
       "1": "a strict surveillance system",
       "2": "a data protection model"
     },
     {
       "0": "Data protection",
       "1": "digital market",
       "2": "information technology"
     }
   ],
   "corrects": [
     1,
     0,
     2,
     0,
     1,
     2,
     0
   ]
 }
 */

const QuestionDropdownInline = (props) => {
  const {
    answers,
    sentence,
    options,
    corrects,
    prevNextButtons,
    givenAnswers,
    currentQuestionIndex,
    feedback,
    onConfirmed,
    title,
    subtitle,
    attempt,
    confirmOnAnswer,
    recoveredAttempt,
    hasButtonSolution,
    percTimer,
    countdownTimer,
    timer,
    solutionVisible,
    questionsLenght
  } = props;
console.log(solutionVisible,'solution')
  const [answeredIndex, setAnsweredIndex] = useState({});
  const [feedbackText, setFeedbackText] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(recoveredAttempt || 1);

  useRecoverExercises(givenAnswers, setAnsweredIndex);

  const [canConfirm, setCanConfirm] = useState(false);

  const structureData = useSelector((state) => state.structure.data);

  useEffect(() => {
    Array.from(document.querySelectorAll(".selectOption")).forEach(function (
      element
    ) {
      element.addEventListener("change", (event) => {
        // get index answer + answer
        const indexes = event.target.value.split("_");
        setAnsweredIndex((answeredIndex) => {
          let cloneAnswers = { ...answeredIndex };
          if (parseInt(indexes[1]) === 0 || parseInt(indexes[1])) {
            cloneAnswers[indexes[0]] = parseInt(indexes[1]);
          } else {
            cloneAnswers[indexes[0]] = null;
          }
          return cloneAnswers;
        });
      });
    });

    // ...

    return () => {
      Array.from(document.querySelectorAll(".selectOption")).forEach(function (
        element
      ) {
        element.removeEventListener("change", () => {});
      });
    };
  }, []);

  /* gestione confirmOnAnswer */
  useEffect(() => {
    if (confirmOnAnswer && canConfirm && !solutionVisible) {
      onConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answeredIndex, confirmOnAnswer, canConfirm]);

  useEffect(() => {
    let allValuesAvailable = true;
    Object.keys(answeredIndex).forEach((key) => {
      if (!answeredIndex[key] && answeredIndex[key] !== 0) {
        allValuesAvailable = false;
      }
    });
    let dropdownCount = sentence.match(/\[\[(.*?)\]\]/gi).length;
    setCanConfirm(
      dropdownCount === Object.keys(answeredIndex).length && allValuesAvailable
    );
  }, [answeredIndex, sentence]);

  const areAnsweredCorrect = () => {
    return (
      JSON.stringify(Object.values(answeredIndex)) === JSON.stringify(corrects)
    );
  };

  const onConfirm = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const okRightAnswer = areAnsweredCorrect();

    // se ho dei tentativi e non li ho bruciati non mostro feedback
    // se ho risposto giusto, non chiedo di riprovare
    const canConvalidate =
      !attempt || attempt <= currentAttempt + 1 || okRightAnswer;

    onConfirmed(answeredIndex, okRightAnswer, canConvalidate);
    if (canConvalidate) {
      /** set color background */
      Array.from(document.querySelectorAll(".selectOption")).forEach(function (
        element
      ) {
        const indexesDOM = element.value.split("_");
        let bgcolor = "#FFF";
        if (answeredIndex[indexesDOM[0]] === corrects[indexesDOM[0]]) {
          bgcolor = "#18A558";
        } else {
          bgcolor = "#e43d40";
        }
        element.style["backgroundColor"] = bgcolor;
        element.style["color"] = "#FFF";
        element.disabled = true;
      });
    }
    if (answeredIndex || answeredIndex === 0) {
        if (feedback) {
          setFeedbackText(areAnsweredCorrect() ? feedback.ok : (!attempt || attempt <= currentAttempt) ? feedback.ko : (feedback.retry || feedbackText.ko));
        } else {
          setFeedbackText(
            areAnsweredCorrect()
              ? answers[answeredIndex].feedback
              : answers[answeredIndex].feedback
          );
        }
    }
  };


  
  const resetSelectOption=()=>{
    Array.from(document.querySelectorAll(".selectOption")).forEach(function (
      element
    ) {
      element.style["backgroundColor"] = "#FFF";
      element.style["color"] = "#333";
      element.disabled = false;
    });
    Array.from(document.querySelectorAll(".selectOption")).forEach(function (
      element,
      i
    ) {
      element.value = `${i}_`;
    });
  }

  const setCorrectAnswer=()=>{
    Array.from(document.querySelectorAll(".selectOption")).forEach(function (
      element,
      i
    ) {
      element.value = `${i}_${corrects[i]}`;
      let bgcolor = "#FFF";
      element.style["backgroundColor"] = bgcolor;
      element.style["color"] = "#000";
    });
  }

  const onRetry = () => {
    setAnsweredIndex({});
    setFeedbackText(null);
    props.onRetry();
    setCanConfirm(false);
    setCurrentAttempt((currentAttempt) => currentAttempt + 1);
    resetSelectOption()
    
  };

  const onSolution = () => {
     //lo uso per nasconedere il pulsante soluzione visto che riporta confirm a false
    setAnsweredIndex({});
    props.onRetry();
    setCorrectAnswer()
  };

  const onCancel = () => {
    // TODO: verificare se tasto cancel deve passare da state in NonEvaluativeTest/MultipleStepTest
    setAnsweredIndex({});
    setFeedbackText(null);
    resetSelectOption()
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
    return (
      !props.confirmed && (
        <input
          className={`btnConfirm`}
          type="submit"
          value={structureData.confirm}
          onClick={onConfirm}
          disabled={isNil(answeredIndex)}
        />
      )
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
        onClick={onRetry}
        disabled={isNil(answeredIndex)}
      />
    ) : (
      <div></div>
    );
  };

  const createSentenceDropDown = () => {
    // Find expression [[number]] and replace each with dropdown
    const allMatch = sentence.match(/\[(.*?)\]\]/gi);
    let nodeToRender = sentence;
    for (let m = 0; m < allMatch.length; m++) {
      let dropdown = `<label class="dropdown"><select class="selectOption" style="font-size: 1.2vw;"><option value="${m}_">${structureData.chooseAnOption}</option>`;
      // options to to show
      for (let op = 0; op < Object.values(options[m]).length; op++) {
        dropdown += `<option value="${m}_${op}">${options[m][op]}</option>`;
      }
      dropdown += "</select></label>";

      nodeToRender = nodeToRender.replace(allMatch[m], dropdown);
    }
    return nodeToRender;
  };

  return (
      <div className={`Question ${styles.QuestionDropdownInline}`} style={{ flexDirection: "column" }}>
        <>
            { !isNil(countdownTimer) && (countdownTimer > 0) &&  <CountdownLine timer={timer} perc={percTimer}/>}
            <HeaderQuestion
              currentQuestionIndex={currentQuestionIndex}
              title={title}
              subtitle={subtitle}
              questionsLenght={questionsLenght}
            />
            <div dangerouslySetInnerHTML={{ __html: createSentenceDropDown() }} />
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
              {canConfirm && buttonConfirm()}
              {buttonRetry()}
              {hasButtonSolution && buttonSolution()}
            </div>
        </>
        {prevNextButtons}
      </div>
  );
};

export default QuestionDropdownInline;
