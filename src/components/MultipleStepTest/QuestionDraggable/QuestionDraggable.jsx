import React, { useEffect, useState,useRef } from "react";
import FeedbackText from "../FeedbackText/FeedbackText";
import HeaderQuestion from "../HeaderQuestion/HeaderQuestion";
import { useSelector } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { isNil } from "ramda";
import {useRecoverExercises} from "../../../utils/useRecoverExercisesState.js";
import CountdownLine from "../CountdownLine/CountdownLine.jsx";
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react'; 

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
   "type": "exercise_draggable",
   "title": "<p>Testo formattato</p>",
   "subtitle": "Ordina le voci trascinandole al posto giusto",
   "score": 0,
   "attempt": 2,
   "audioQuestion": "01_01",
   "answers": [
       {
           "text": "<p>Energetica</p>",
           "order": "3",
           "id": 1
       },
       {
           "text": "<p>Sinergica</p>",
           "order": "5",
           "id": 2
       },
       {
           "text": "<p>Carismatica</p>",
           "order": "2",
           "id": 3
       },
       {
           "text": "<p>Poliedrica</p>",
           "order": "4",
           "id": 4
       },
       {
           "text": "<p>Attraente</p>",
           "order": "1",
           "id": 5
       },
       {
           "text": "<p>Virtuosa</p>",
           "order": "6",
           "id": 6
       }
   ]
 }
 */

const QuestionDraggable = (props) => {
  const {
    answers,
    attempt,
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
    questionsLenght
  } = props;


  const [feedbackText, setFeedbackText] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(recoveredAttempt || 1);

  const structureData = useSelector((state) => state.structure.data);

    useRecoverExercises(givenAnswers, setUserAnswers);

    useEffect(() => {
      console.log('ciao')
        if (answers.find((a) => isNil(a.id))) {
            console.error("All answers in questionDraggable must have an id");
        }
        setUserAnswers((oldValue) => {
            if (oldValue.length === 0) {
                return answers;
            }
            return oldValue;
        });
    }, [answers]);

  const areAnsweredCorrect = () => {
    // ordino correttamente per order le risposte di struttura
    const reorderedAnswer = [...answers];
    reorderedAnswer.sort((a, b) => (a.order > b.order ? 1 : -1));
    // elimino elemento che serve alla libreria di drag
    const filteredAnswers = userAnswers.filter((v) => !v.chosen);
    return JSON.stringify(reorderedAnswer) === JSON.stringify(filteredAnswers);
  };

  const onConfirm = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const youAnswers = areAnsweredCorrect();
    // se ho dei tentativi e non li ho bruciati non mostro feedback
    // se ho risposto giusto oppure ho finito i tentativi, posso sbloccare la pagina
    const canConvalidate =
      !attempt || attempt <= currentAttempt || youAnswers;
    // setto il tentativo
    onConfirmed(userAnswers, youAnswers, canConvalidate);
      if (feedback && !isHideFeedback) {
        setFeedbackText(youAnswers ? feedback.ok : (!attempt || attempt <= currentAttempt) ? feedback.ko : (feedback.retry ?? ''));
      }
  };

  const buttonConfirm = () => {
    return !props.confirmed ? (
      <input
        className={`btnConfirm`}
        type="submit"
        value={structureData.confirm}
        onClick={onConfirm}
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
        onClick={() => {
            setFeedbackText('');
            setCurrentAttempt((currentAttempt) => currentAttempt + 1);
            props.onRetry()
        }}
      />
    ) : (
      <div></div>
    );
  };

  /*const handleDragEnd = e => { return e.related.className.indexOf('static') === -1};*/
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setUserAnswers((list) => {
        let activeIndex = list.findIndex((el) => el.id === active.id);
        let overIndex = list.findIndex((el) => el.id === over.id);
        return arrayMove(list, activeIndex, overIndex);
      });
    }
  };

  const listRef = useRef();

 

  

  return (
    <div className="Question">

      <HeaderQuestion
        currentQuestionIndex={currentQuestionIndex}
        title={title}
        subtitle={subtitle}
        questionsLenght={questionsLenght}
      ></HeaderQuestion>
        <div style={{ position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '10px'}}
                       ref={listRef}>
              {userAnswers.map((answer, index) => (
                <SortableItem
                
                  key={"di_" + answer.id}
                  id={answer.id}
                  ok={
                      !isHideFeedback &&
                    props.confirmed &&
                    (areAnsweredCorrect() ||
                      (attempt && attempt <= currentAttempt)) &&
                    index === parseInt(answer.order - 1)
                  }
                  ko={
                      !isHideFeedback &&
                    props.confirmed &&
                    attempt &&
                    attempt <= currentAttempt &&
                    index !== parseInt(answer.order - 1)
                  }
                  touched={answer.touched}
                  correctOrder={answer.order}
                  index={index}
                  text={answer.text}
                  position={answer.position}
                  handleReorder={11}
                ></SortableItem>
              ))}
        </div>
      {feedbackText && (
        <FeedbackText
          isCorrect={areAnsweredCorrect()}
          feedbackText={feedbackText}
        ></FeedbackText>
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

export default QuestionDraggable;


/*

<div className={"Question"}>
      { !isNil(countdownTimer) && (countdownTimer > 0) &&  <CountdownLine timer={timer} perc={percTimer}/>}
      <HeaderQuestion
        currentQuestionIndex={currentQuestionIndex}
        title={title}
        subtitle={subtitle}
        questionsLenght={questionsLenght}
      ></HeaderQuestion>
        <div style={{touchAction: 'none'}}>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              disabled={props.confirmed}
              items={userAnswers}
              strategy={verticalListSortingStrategy}
            >
              {userAnswers.map((answer, index) => (
                <SortableItem
                  key={"di_" + answer.id}
                  id={answer.id}
                  ok={
                      !isHideFeedback &&
                    props.confirmed &&
                    (areAnsweredCorrect() ||
                      (attempt && attempt <= currentAttempt)) &&
                    index === parseInt(answer.order - 1)
                  }
                  ko={
                      !isHideFeedback &&
                    props.confirmed &&
                    attempt &&
                    attempt <= currentAttempt &&
                    index !== parseInt(answer.order - 1)
                  }
                  correctOrder={answer.order}
                  index={index}
                  text={answer.text}
                  handleReorder={handleReorder}
                ></SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      {feedbackText && (
        <FeedbackText
          isCorrect={areAnsweredCorrect()}
          feedbackText={feedbackText}
        ></FeedbackText>
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
 */

    ////////////

    
  
/*
    requestAnimationFrame(() => {
      const listItems = Array.from(listRef.current.children);
      const updatedPositions = listItems.map((el) => el.getBoundingClientRect().top);

      // Step 5: Calculate and animate the difference in Y positions
     listItems.forEach((el, index) => {
      console.log({updatedPositions, initialPositions,index})
       // console.log({listItems,updatedPositions})

       //qui il problema
       const x = initialId[index]
        const dy = initialPositions[index]  - updatedPositions[index];
       
      console.log(dy,initialId )
        
 
        gsap.to(el, {
          y: dy,
          duration: 1,
          ease: "power2.out"
        });
      });
      
    });*/
   /////////////////////////////////