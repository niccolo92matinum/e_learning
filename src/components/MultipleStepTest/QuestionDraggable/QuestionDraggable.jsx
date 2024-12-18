import React, { useEffect, useState, useRef } from "react";
import FeedbackText from "../FeedbackText/FeedbackText";
import HeaderQuestion from "../HeaderQuestion/HeaderQuestion";
import { useSelector } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import SortableItem from "./SortableItem";
import { isNil } from "ramda";
import {useRecoverExercises} from "../../../utils/useRecoverExercisesState.js";
import CountdownLine from "../CountdownLine/CountdownLine.jsx";
import gsap from 'gsap';
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
    questionsLenght,
    confirmed
  } = props;

  const [feedbackText, setFeedbackText] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(recoveredAttempt || 1);

  const structureData = useSelector((state) => state.structure.data);



    useEffect(() => {
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

  const isUserTouchedAllAnswere = userAnswers.some(obj => obj.touched === false);

console.log({userAnswers,isUserTouchedAllAnswere,prp:props.confirmed,structureData})
  const buttonConfirm = () => {
      return !props.confirmed ? (
        <input
          className={`btnConfirm`}
          type="submit"
          value={structureData.confirm}
          onClick={(e)=>onConfirm(e)}
          disabled={isUserTouchedAllAnswere}
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
    console.log({active,over})
    /*
    if (active.id !== over.id) {
      setUserAnswers((list) => {
        let activeIndex = list.findIndex((el) => el.id === active.id);
        let overIndex = list.findIndex((el) => el.id === over.id);
        return arrayMove(list, activeIndex, overIndex);
      });
    }*/
  };

  const listRef = useRef();

  const handleReorder = (clickedId) => {
    
    // Capture the initial positions of items
    const listItems = Array.from(listRef.current.children);
//controllo se l'elemnto è stato selezionato altrimenti faccio il rollback
    const isElementChecked = userAnswers.find(el => el.id === clickedId).touched 
   const checkIfTestStart = userAnswers.some((obj) => obj.touched === true);

let reorderedItems = [];
if(checkIfTestStart === false){

  reorderedItems = [
    ...userAnswers.filter((item) => item.id === clickedId),
    ...userAnswers.filter((item) => item.id !== clickedId)
  ];
}else if(isElementChecked === false && checkIfTestStart === true){

  reorderedItems = [
    ...userAnswers.filter((item) => item.touched === true),
    ...userAnswers.filter((item) => item.id === clickedId),
    ...userAnswers.filter((item) => ((item.id !== clickedId) && (item.touched === false)))
  ];
}else if(isElementChecked === true && checkIfTestStart === true){
 

  reorderedItems = [
    ...userAnswers.filter((item) => (item.id !== clickedId &&  item.touched === true) ),
    ...userAnswers.filter((item) => item.id === clickedId ),
    ...userAnswers.filter((item) => item.touched === false )
  ];
}

    const reorderedItemsWithNewPosition = reorderedItems.map((el,index) =>{
      el = {...el,...{position:index}}
      if(el.id === clickedId &&  el.touched === false ){
        //el.touched = true
       el = {...el,...{touched:true}}
      }else if(el.id === clickedId &&  el.touched === true ){
        el = {...el,...{touched:false}}
      }
      return el;
    } )

    const initialData = listItems.map((item) => ( {id:item.getAttribute("data-id"),position:item.getAttribute("data-key"),top:item.getBoundingClientRect().top}))
   
    listItems.forEach((item, index) => {
      // After state update, calculate new positions
      //const newElposition = reorderedItemsWithNewPosition.find(el => el.id === clickedId).position

      //const newpposition = initialData.find(el => Number(el.position) === newElposition).top
     const prova = reorderedItemsWithNewPosition.find(el => el.id === Number(item.getAttribute("data-id"))).position
     const newAlign = initialData.find(el => Number(el.position) === prova).top
     const oldIlign = initialData[index].top
     
      let tot = Math.trunc(oldIlign) - Math.trunc(newAlign)

        let newTot = tot
      if(tot !== 0){
         newTot = - tot
      }
      
   gsap.to(
      item,
      {
        y: newTot,
        duration: 0.5,
        ease: "power1.out",
       onComplete: () => {
        setUserAnswers(reorderedItemsWithNewPosition) 
       }
      })
  });
  
  };


  useEffect(()=>{
    const listItems = Array.from(listRef.current.children);
  
    listItems.forEach((item, index) => {
      gsap.set(item, { clearProps: "all" });
    })
  },[userAnswers])


  return (
    <div className={"Question"}>
     
      <div className='container_sortable'>
        <div className="container_child">
        { !isNil(countdownTimer) && (countdownTimer > 0) &&  <CountdownLine timer={timer} perc={percTimer}/>}
      <HeaderQuestion
        currentQuestionIndex={currentQuestionIndex}
        title={title}
        subtitle={subtitle}
        questionsLenght={questionsLenght}
      ></HeaderQuestion>
        </div>
        <div  className="container_child bottom"  style={{touchAction: 'none'}}>
          <div ref={listRef}   className='container_answere'>
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
                  position={answer.position}
                  touched={answer.touched}
                ></SortableItem>
              ))}
          </div>
          </div>
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
