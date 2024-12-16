import React, {useEffect, useMemo, useReducer} from "react";
import styles from "./MultipleStepTest.module.scss";
import "./Question.scss";
import FinalProfile from "./FinalProfile/FinalProfile";
import FinalTestWelcome from "./FinalTestWelcome/FinalTestWelcome";
import PrevNextButtons from "./PrevNextButtons/PrevNextButtons";
import BtnChevron from "./BtnChevron/BtnChevron.jsx";
import useAudioExercise from "../../utils/useAudioExercise";
import { useDispatch, useSelector } from "react-redux";
import { courseActions } from "../../store/slices/courseSlice";
import ExerciseBgContainer from "./ExerciseBgContainer/ExerciseBgContainer.jsx";
import Sound from 'react-sound';
import getComponentById from "../../utils/getComponentById.js";
import useCountdownTimer from "../../utils/useCountdownTimer.js";
import SummaryDetailTable from "./SummaryDetailTable/SummaryDetailTable.jsx";
import {bookmarkActions} from "../../store/slices/bookmarkSlice.js";
import {
    buildFilteredExercises,
    createInitialState,
    isCurrentConfirmed,
    isCurrentCorrect,
    isCurrentViewed
} from "./utils/multipleStepTestUtils.js";
import {isNil} from "ramda";
import {recoverExercises, SRV_PREFIX, TEST_PREFIX} from "../../lmsUtils/lms.js";

/**
 *
 * @param state
 * @param action
 *
 * welcomeScreen: mostra schermata iniziale del test
 * track:
 *  - true: viene tracciato passed/completed
 *  - false: viene tracciato page viewed
 * limit: indica quante esercitazioni pescare dal basket
 * random: posizione random delle esercitazioni nel test
 * shuffleAnswers: posizione random delle risposte
 * summaryDetail: se presente l'ggetto, indica cosa mostrare nella tabella di riepilogo (risposte corrette, risposte date, colonna ripasso). Se non presente nel json, non viene mostrata la tabella (funzionante solo per exercise_single e exercise_multiple)
 * timer: indica (in secondi) se c'è un countdown entro cui rispondere nel test finale
 * id: nel caso di assessment/survey ciascuna esercitazione deve avere un id (string)
 * "groups": { // indica quante esercitazioni pescare da ciascun gruppo
 *    "G1": 3, // es. pesca 3 esercitazioni con groupId G1
 *    "G2": 2  // es. pesca 2 esercitazioni con groupId G2
 *  },
 *  audioQuestion: indica il codice del file audio da usare per la domanda (es. 01_01 apre 01_01.mp3)
 *
 {
     "id": 1,
     "position": "end",
     "component": {
         "id": "",
         "type": "multiple_step_test",
         "config": {
             "welcomeScreen": true,
             "summaryDetail": {
                "answered": true,
                "correct": true,
                "review": true
             },
             "track": true,
         },
         "limit": 1,
         "random": true,
         "shuffleAnswers": true,
         "attempt": 5,
         "timer": 60,
         "groups": {
            "G1": 3,
            "G2": 2
         },
         "confirmOnAnswer": true,
         "isHideFeedback": true,
         "elements": [
             {
                 "id": "EX_1",
                 "groupId": "G1",
                 "feedback": {
                     "ok": "La risposta che hai dato è quella corretta",
                     "ko": "Purtroppo non mi conosci"
                 },
                 "type": "exercise_single",
                 "review": "Esempio testo ripasso domanda 1",
                 "title": "Quale tra questi prodotti è bio based",
                 "subtitle": "Vediamo se indovini",
                 "score": 10,
                 "audioQuestion": "01_01",
                 "answers": [
                     {
                        "text": "Sacchetto di plastica"
                     },
                     {
                         "text": "Camicia di cotone",
                         "correct": true
                     },
                     {
                        "text": "Nessuno"
                     }
                ]
            },
            {
                 "id": "EX_2",
                 "groupId": "G2",
                 "feedback": {
                     "ok": "La risposta che hai dato è quella corretta",
                     "ko": "Purtroppo non mi conosci"
                },
             "type": "exercise_multiple",
             "title": "Quali tra questi rappresenta un tipo di biomassa",
             "score": 10,
             "audioQuestion": "01_01",
             "answers": [
             {
                 "text": "Gusci d'uova",
                 "correct": true
             },
             {
                 "text": "Alghe",
                 "correct": true
             },
             {
                 "text": "Legno",
                 "correct": true
             },
             {
                "text": "Nessuno"
             },
             {
                 "text": "Grano",
                 "correct": true
             }
            ]
            }
         ]
     }
 }
 */
const exercisesReducer = (state, action) => {
  switch (action.type) {
    case "QUESTION_CONFIRMED":
      return {
        ...state,
        arrayStates: action.payload.arrayStates,
        score: action.payload.score,
      };
    case "UPDATE_STATE":
      return {
          ...state,
          arrayStates: action.payload.arrayStates,
      };
    case "QUESTION_RETRY":
      return {
        ...state,
        correct: false,
        arrayStates: state.arrayStates.map((ex, index) => (index === state.currentQuestionIndex) ? {...ex, confirmed: false, givenAnswers: null } : ex )
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: action.payload.nextQuestionIndex,
      };
    case "SET_FINAL_PROFILE":
      return { ...state, isFinalProfile: action.payload.isFinalProfile };
    case "SET_ATTEMPT":
      return { ...state, attempt: action.payload.attempt };
    case "PREV_QUESTION":
      return { ...state, currentQuestionIndex: state.currentQuestionIndex - 1 };
    case "RETRY_TEST":
        const newFilteredExercises = buildFilteredExercises(action.payload)
      return {
        ...state,
        ...newFilteredExercises,
        isFinalProfile: false,
        currentQuestionIndex: 0,
        score: 0,
        solutionVisible: false
      };
    case "SHOW_ANSWERS":
      return {
        ...state,
        solutionVisible: true,
        isFinalProfile: false,
        currentQuestionIndex: 0,
      };
    case "START_TEST":
      return { ...state, solutionVisible: false, isStartTestMessage: false };
    default:
      return { ...state };
  }
};

/**
 * MultipleStepTest contiene una lista di Componenti e ne gestisce l'avanzamento man mano che si risponde. (Ad esempio final test con più domande)
 *
 * arrayStates [{el: e, index: i}] per ciascuna esercitazione contiene un object che indica props dell'esercitazione e index
 */
const MultipleStepTest = (props) => {

  const countdown = useCountdownTimer(props.test.timer*100000);

  const dispatch = useDispatch();

  const structureData = useSelector((state) => state.structure.data);

  const bookmarkData = useSelector((state) => state.bookmark);

  // TODO: logica custom per assessment (fa il check sulla presenza di **SRV**). Scrivere codice generico o in base a variabile d'ambiente

  const lmsData = useSelector((state) => state.lms.data);

  const calcTotalScore = (arrayStates)=>{
      return arrayStates.reduce(((accumulator, currentValue) => currentValue.correct ? ((currentValue.el.score || 1) + accumulator) : accumulator),0)
  }


  const initialExerciseState = useMemo(()=>{
      const arrayStates = bookmarkData.trackingString && (bookmarkData.trackingString.indexOf(SRV_PREFIX) >= 0 || bookmarkData.trackingString.indexOf(TEST_PREFIX) >= 0) ? recoverExercises({exercises: props.test?.elements, recoverTracking: bookmarkData.trackingString}) : null;
      return {
          exercises: props?.test?.elements,
          random: props?.test?.random,
          limit: props?.test?.limit,
          groups: props?.test?.groups,
          recoverTracking: bookmarkData.trackingString,
          arrayStates,
          userAttempt: bookmarkData.finalTest?.userAttempt || 0,
          totalAttempt: props?.test?.attempt,
          shuffleAnswers: props?.test.shuffleAnswers,
          isFinalProfile: !!bookmarkData.trackingString && (bookmarkData.trackingString.indexOf(SRV_PREFIX) >= 0 || bookmarkData.trackingString.indexOf(TEST_PREFIX) >= 0) ? bookmarkData.trackingString : false, // se ha stringa di tracciamento porto subito nel profilo finale
          isStartTestMessage: bookmarkData.trackingString && (bookmarkData.trackingString.indexOf(SRV_PREFIX) >= 0 || bookmarkData.trackingString.indexOf(TEST_PREFIX) >= 0) ? !bookmarkData.trackingString : true,
          score: arrayStates ? calcTotalScore(arrayStates) : 0
      }
  },[props, bookmarkData]);

  const [exercisesState, dispatchExercises] = useReducer(exercisesReducer, initialExerciseState, createInitialState);

    useEffect(() => {
        if (countdown.timeOver){
            onClickFinalProfileHandler();
        }
    }, [countdown.timeOver]);

  const exerciseParams = exercisesState?.arrayStates[exercisesState?.currentQuestionIndex].el;
    const [audioPlayStatus, audioSrc, stopAudioHandler, volume] = useAudioExercise(
    exercisesState?.isStartTestMessage,
    isCurrentViewed(exercisesState?.arrayStates,exercisesState?.currentQuestionIndex),
    isCurrentConfirmed(exercisesState?.arrayStates,exercisesState?.currentQuestionIndex),
    isCurrentCorrect(exercisesState?.arrayStates,exercisesState?.currentQuestionIndex),
    props.test.elements[exercisesState?.currentQuestionIndex],
    props.test.isHideFeedback,
    props.currentLang,
    props.muted
  );

  const onQuestionConfirmed = (_answeredIndexes, _correct, _canConvalidate) => {
    let updatedState = [...exercisesState.arrayStates];
    updatedState[exercisesState.currentQuestionIndex].confirmed = true;
    updatedState[exercisesState.currentQuestionIndex].viewed = !!_canConvalidate;
    updatedState[exercisesState.currentQuestionIndex].correct = _correct;
    updatedState[exercisesState.currentQuestionIndex].givenAnswers = _answeredIndexes;
    dispatchExercises({
      type: "QUESTION_CONFIRMED",
      payload: {
        arrayStates: updatedState,
        score: calcTotalScore(updatedState)
      },
    });
  };

  const onReviewOpened = (index)=>{
      const updatedState = exercisesState.arrayStates.map(state => {
          if (state.index === index){
              return {
                  ...state,
                  reviewed: true
              }
          }
          return state;
      })
      dispatchExercises({
          type: "UPDATE_STATE",
          payload: {
              arrayStates: updatedState
          },
      });
      trackViewedPage(updatedState, exercisesState.attempt);
  }

    const trackViewedPage = (updatedState, attempt) => {
        let scorePerc = Math.round((exercisesState.score / exercisesState.maxScore) * 100);
        let passed = (scorePerc >= (lmsData.mastery_score || 0)) ? "passed" : "failed";
        // se tutte le esercitazioni risultano viewed e se non sono in fase di showSolution
        if (!exercisesState?.solutionVisible) {
            dispatchExercises({
                type: "SET_ATTEMPT",
                payload: { attempt }
            })
            dispatch(
                bookmarkActions.updateFinalTest({
                    finalTest: {
                        numQuestions: exercisesState.exercisesTotalCount,
                        extractedQuestionsCount: exercisesState.extractedExercisesCount,
                        masteryScore: lmsData.mastery_score,
                        userScore: scorePerc,
                        userAttempt: attempt,
                        totalAttempt: exercisesState.totalAttempt,
                        arrayStates: updatedState || exercisesState.arrayStates,
                        passed: props.test.config.track && !isNil(lmsData.mastery_score) ? passed : null
                    }
                })
            );

            props.onTrackViewedComponent(
                { finalTestStatus: props.test.config.track
                        ? { passed: passed, scorePerc: scorePerc }
                        : null
                }
            );
        }
    }

  const onClickFinalProfileHandler = () => {
      trackViewedPage(exercisesState.arrayStates, exercisesState.attempt + 1);
      countdown.stopTimer();
      dispatchExercises({
          type: "SET_FINAL_PROFILE",
          payload: {isFinalProfile: true},
      })
  }

  const onRetrySingleExerciseHandler = () => {
    dispatchExercises({
      type: "QUESTION_RETRY",
    });
  };
  /**
   * Restituisce l'indice della prossima esercitazione non viewed (quindi anche quelle saltate)
   * @returns {number|*}
   */
  const getNextQuestionIndex = () => {
    if (exercisesState?.arrayStates && exercisesState?.arrayStates.length > 0) {
      return exercisesState?.arrayStates.findIndex((ex) => !ex.viewed);
    }
    return -1;
  };

  /**
   *
   * onNextQuestion riporta alla prima risposta non data se ci si trova alla fine del set di domande
   * @param firstIndexNotAnswered
   */
  const onNextQuestion = (firstIndexNotAnswered) => {
    let nextQuestion = exercisesState?.currentQuestionIndex + 1;
    if (
      exercisesState?.arrayStates.length - 1 <=
        exercisesState?.currentQuestionIndex &&
      firstIndexNotAnswered >= 0
    ) {
      nextQuestion = firstIndexNotAnswered;
    }

    dispatchExercises({
      type: "NEXT_QUESTION",
      payload: { nextQuestionIndex: nextQuestion },
    });
    dispatch(courseActions.setCurrentExerciseIdx(nextQuestion));
  };

  const renderBtnNextQuestion = () => {
    /** controllo l'indice della prima risposta non data */
    let firstIndexNotAnswered = getNextQuestionIndex();

    // se ci sono altri esercizi nell'array o se devo tornare a un esercizio saltato
    if (
      exercisesState?.arrayStates.length > 0 && // ci sono più esercitazioni nell'array
      exercisesState?.arrayStates.length - 1 >
        exercisesState?.currentQuestionIndex && // non sono all'ultimo elemento
        (exercisesState?.solutionVisible || isCurrentConfirmed(exercisesState?.arrayStates,exercisesState?.currentQuestionIndex)) // se confermato, o se sto visualizzando soluzione
    ) {
      return (
        <BtnChevron
          onClickHandler={() => {
            onNextQuestion(firstIndexNotAnswered);
          }}
        >
          {structureData.next_question}
        </BtnChevron>
      );
    }
    // se non sono alla fine ma non ho ancora risposto posso skippare (isNextStepButtonVisible è false)
    /*else if (
      exercisesState?.currentQuestionIndex <
        exercisesState?.arrayStates.length &&
      firstIndexNotAnswered >= 0 &&
      firstIndexNotAnswered !== exercisesState?.arrayStates.length - 1
    ) {
      // se rimane da rispondere solo all'ultima esercitazione non posso più skippare
      return (
        <BtnChevron
          onClickHandler={() => {
            onNextQuestion(firstIndexNotAnswered);
          }}
        >
          {structureData.skip}
        </BtnChevron>
      );
    }*/
    // se sono nel test finale e non ci sono esercizi saltati, oppure ho risposto a tutto, passo al profilo finale
    else if (
      exercisesState?.arrayStates.length > 0 &&
        (firstIndexNotAnswered < 0 || exercisesState?.solutionVisible)
    ) {
      return (
        <BtnChevron
          onClickHandler={() => {
              onClickFinalProfileHandler()
            }
          }
        >
          {structureData.final_profile}
        </BtnChevron>
      );
    }
    return null;
  };
  const renderBtnPrevQuestion = () => {
    return (
      exercisesState?.currentQuestionIndex > 0 && (
            <BtnChevron
                isBack={true}
                onClickHandler={() => dispatchExercises({ type: "PREV_QUESTION" })}
            >
                {structureData.prev_question}
            </BtnChevron>
      )
    );
  };

  const prevNextButtons = () => {
    return (
      <PrevNextButtons
        btnPrevQuestion={renderBtnPrevQuestion()}
        btnNextQuestion={renderBtnNextQuestion()}
      />
    );
  };

  let Exercise = getComponentById(exerciseParams?.type);

  const renderEl = <Exercise {...exerciseParams}
                             onConfirmed={onQuestionConfirmed}
                             onRetry={onRetrySingleExerciseHandler}
                             currentQuestionIndex={exercisesState?.currentQuestionIndex}
                             confirmOnAnswer={props.test.confirmOnAnswer}
                             prevNextButtons={prevNextButtons()}
                             solutionVisible={exercisesState?.solutionVisible}
                             confirmed={isCurrentConfirmed(exercisesState?.arrayStates,exercisesState?.currentQuestionIndex)}
                             isHideFeedback={!exercisesState?.solutionVisible} /*nel test finale mostro sempre il feedback al click su showSolution*/
                             key={"exercise_" + exercisesState?.currentQuestionIndex}
                             givenAnswers={exercisesState?.arrayStates[exercisesState?.currentQuestionIndex]?.givenAnswers}
                             percTimer={countdown.timer*100/countdown.initialTimer}
                             timer={countdown.timer}
                             countdownTimer={props.test.timer}
                             questionsLenght={exercisesState?.arrayStates.length}
                            />
  const renderEsercitazioneTest = () => {
    return (
      <div className={styles.ExerciseSingle}>
          <ExerciseBgContainer>
            {renderEl}
            {exercisesState.arrayStates[exercisesState?.currentQuestionIndex].el
              ?.audioQuestion && audioSrc && (
                <Sound playStatus={audioPlayStatus} url={audioSrc} onFinishedPlaying={stopAudioHandler} volume={volume}/>
            )}
          </ExerciseBgContainer>
      </div>
    );
  };
  const renderFinalTest = () => {
    if (props.test.config.welcomeScreen && exercisesState?.isStartTestMessage) {
      return (
        <FinalTestWelcome
          title={props.test.title}
          exercisesLength={exercisesState?.arrayStates.length}
          maxScore={exercisesState?.maxScore}
          masterScore={lmsData.mastery_score}
          onStartTest={() => {
              props.test.timer && countdown.startTimer();
              dispatchExercises({ type: "START_TEST" });
          }}
          timer={props.test.timer}
        />
      );
    }
    if (exercisesState?.isFinalProfile) {
      return (
        <FinalProfile
          score={exercisesState?.score}
          showReview={props.test.config.summaryDetail?.review}
          resetTest={() => {
              props.test.timer && countdown.startTimer();
              dispatchExercises({
                  type: "RETRY_TEST",
                  payload: {...initialExerciseState}/*{ exercises: exercisesState?.filteredElements }*/,
              });
          }}
          showAnswers={() => {
            dispatchExercises({ type: "SHOW_ANSWERS" });
          }}
          canRetry={!exercisesState?.solutionVisible && exercisesState?.attempt < exercisesState?.totalAttempt}
          maxScore={exercisesState?.maxScore}
          arrayStates={exercisesState?.arrayStates}
          setIsEndedCourse={props.setIsEndedCourse}
        >
            {props.test.config.summaryDetail && <SummaryDetailTable answered={props.test.config.summaryDetail.answered} correct={props.test.config.summaryDetail.correct} review={props.test.config.summaryDetail?.review} arrayStates={exercisesState?.arrayStates} onReviewOpened={onReviewOpened}/>}
        </FinalProfile>
      );
    }
    return renderEsercitazioneTest();
  };

  return renderFinalTest();
};

export default MultipleStepTest;
