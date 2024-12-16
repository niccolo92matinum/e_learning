import React, {useEffect, useState} from "react";
import Card from "./Card";
import FeedbackText from "../FeedbackText/FeedbackText";
import HeaderQuestion from "../HeaderQuestion/HeaderQuestion";
import styles from "./QuestionCard.module.scss";
import {useSelector} from "react-redux";
import {useRecoverExercises} from "../../../utils/useRecoverExercisesState.js";
import {isNil} from "ramda";
import CountdownLine from "../CountdownLine/CountdownLine.jsx";

/**
 *
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
  "type": "exercise_card",
  "title": "<p>Titolo formattato</p>",
  "subtitle": "Sottotitolo",
  "score": 1,
  "attempt": 2,
  "audioQuestion": "01_01",
  "answers": [
      {
          "text": "<p>Testo frontale 1</p>",
          "cover": "./assets/images/exercises/card-01.png",
          "feedback": "<h5>Errato! <br /><i class=\"fa fa-times\" aria-hidden=\"true\"></i></p>"
      },
      {
          "text": "<p>Testo frontale 2</p>",
          "cover": "./assets/images/exercises/card-02.png",
          "feedback": "<h5>Errato! <br /><i class=\"fa fa-times\" aria-hidden=\"true\"></i></h5>"
      },
      {
          "text": "<p>Testo frontale 3</p>",
          "cover": "./assets/images/exercises/card-03.png",
          "feedback": "<h5>Esatto! <br /><i class=\"fa fa-check\" aria-hidden=\"true\"></i></h5>",
          "correct": true
      }
  ]
}
 */
const QuestionCards = (props) => {
    const {
        answers,
        attempt,
        feedback,
        prevNextButtons,
        currentQuestionIndex,
        onConfirmed,
        givenAnswers,
        recoveredAttempt,
        title,
        subtitle,
        isHideFeedback,
        confirmOnAnswer,
        percTimer,
        countdownTimer,
        timer,
        questionsLenght
    } = props;

    const [answeredIndex, setAnsweredIndex] = useState();
    const [feedbackText, setFeedbackText] = useState(null);
    const [currentAttempt, setCurrentAttempt] = useState(recoveredAttempt || 1);

    const structureData = useSelector((state) => state.structure.data);

    useRecoverExercises(givenAnswers, setAnsweredIndex);

    const areAnsweredCorrect = (_answerIndex) => {
        let correctIndex = -1;
        answers.map((answer, i) => {
            if (answer.correct) {
                correctIndex = i;
            }
            return correctIndex;
        });
        return correctIndex === _answerIndex;
    };

    const onConfirm = (event, _answeredIndex) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const okRightAnswer = areAnsweredCorrect(_answeredIndex); // passare _answeredIndex
        // se ho dei tentativi e non li ho bruciati non mostro feedback
        // se ho risposto giusto oppure ho finito i tentativi, posso sbloccare la pagina
        const canConvalidate =
            !attempt || attempt <= currentAttempt || okRightAnswer;

        onConfirmed(_answeredIndex, okRightAnswer, canConvalidate);
        if (!isHideFeedback && (_answeredIndex || _answeredIndex === 0)) {
            if (feedback) {
                setFeedbackText(okRightAnswer ? feedback.ok : (!attempt || attempt <= currentAttempt) ? feedback.ko : (feedback.retry || feedbackText.ko));
            } else {
                setFeedbackText(
                    areAnsweredCorrect(_answeredIndex)
                        ? answers[_answeredIndex].feedback
                        : answers[_answeredIndex].feedback
                );
            }
        }
    };

    const buttonConfirm = () => {
        return (
            !isNil(answeredIndex) &&
            !props.confirmed &&
            !confirmOnAnswer && (
                <input
                    className={`btnConfirm`}
                    type="submit"
                    value={structureData.confirm}
                    onClick={(event) => onConfirm(event, answeredIndex)}
                />
            )
        );
    };

    const buttonRetry = () => {
        return props.confirmed &&
        attempt &&
        attempt > currentAttempt &&
        !areAnsweredCorrect(answeredIndex) ? (
            <input
                className={`btnConfirm secondary`}
                type="submit"
                value={structureData.retry}
                onClick={() => {
                    props.onRetry();
                    setCurrentAttempt((attempt) => attempt + 1);
                    setAnsweredIndex([]);
                    setFeedbackText(null);
                }}
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
            <div className={styles.cardsContainer}>
                {answers.map((el, key) => {
                    return (
                        <Card
                            key={"card_" + key}
                            handleChange={(event) => {
                                if (!props.confirmed) {
                                    // rimuovo evenutali scale dovuti a riprova
                                    document
                                        .querySelectorAll(".flippy-cardContainer")
                                        .forEach((elem) => {
                                            elem.style.transform = "scale(1)";
                                        });
                                    /* mostro visivamente all'utente quale ha cliccato */
                                    event.currentTarget.parentElement.style.transform =
                                        "scale(1.05)";

                                    setAnsweredIndex([key]);
                                    if (confirmOnAnswer) {
                                        onConfirm(event, key);
                                    }
                                }
                            }}
                            cardInfo={{
                                flipped: !!(
                                    (
                                        answeredIndex === key && props.confirmed
                                    ) /* || (feedbackText && props.confirmed)*/
                                ),
                                /*props.confirmed &&
                                      (!attempt || attempt <= currentAttempt || isCorrect)*/ frontContent:
                                el.text,
                                backContent: !isHideFeedback ? el.feedback : el.text,
                                // cover: el.cover ? el.cover : null,
                                colorBackCard: !isHideFeedback
                                    ? el.correct
                                        ? "rgb(24, 165, 88)"
                                        : "rgb(228, 61, 64)"
                                    : "#FFF",
                                id: key,
                            }}
                        />
                    );
                })}
            </div>
            {feedbackText && (
                <FeedbackText
                    isCorrect={areAnsweredCorrect(answeredIndex)}
                    feedbackText={feedbackText}
                ></FeedbackText>
            )}
            <div
                style={{
                    flex: "1 0 auto",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    marginTop: "30px",
                }}
            >
                {buttonConfirm()}
                {buttonRetry()}
            </div>

            {prevNextButtons}
        </div>
    );
};

export default QuestionCards;
