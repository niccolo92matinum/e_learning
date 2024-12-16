import React, {useRef, useState} from 'react';
import styles from './SummaryDetailTable.module.scss';
import {faCheck, faMagnifyingGlass, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSelector} from "react-redux";
import Dialog from "../../Dialog/Dialog.jsx";
import {Button} from "../../Button/Button.jsx";

/**
 *
 * @param answered
 * @param correct
 * @param arrayStates
 * @param onReviewOpened
 * @returns {Element}
 * @constructor
 *
 * Mostra una tabella di riepilogo dei risultati ottenuti dall'utente (funzionante solo per exercise_single e exercise_multiple)
 */
const SummaryDetailTable = ({ answered, correct, review, arrayStates, onReviewOpened }) => {

    const structureData = useSelector((state) => state.structure.data);

    const modalRef = useRef(null);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    const onOpenReviewHandler = (review, index)=>{
        onReviewOpened(index);
        setReviewModalOpen(review)
        modalRef.current.showModal();
    }

    const onCloseReview = ()=>{
        setReviewModalOpen(false)
        modalRef.current.close();
    }

    // SummaryDetail attualmente supportata solo da exercise_single e exercise_multiple
    const supportedSummaryDetailTableExercises = arrayStates.map(exercise => {
        if (exercise.el.type === "exercise_single" || exercise.el.type === "exercise_multiple"){
            return exercise;
        }else{
            return {
                ...exercise,
                givenAnswers: null
            }
        }
    });

    return (
        <>
            <div className={styles.SummaryDetailTable}>
                <table>
                    <thead>
                        <tr>
                            {correct && <td>{structureData.result}</td>}
                            <td>{structureData.question}</td>
                            {answered && <td>{structureData.given_answer}</td>}
                            {review && <td>{structureData.review}</td>}
                        </tr>
                    </thead>
                    <tbody>
                    { supportedSummaryDetailTableExercises.map((exercise, exerciseIndex) => <tr key={`tr_${exerciseIndex}`}>
                        {correct && <td>
                            <FontAwesomeIcon
                                icon={exercise.correct ? faCheck : faXmark}
                                size="lg"
                            />
                        </td>}
                        <td>{exercise.el.title}</td>
                        {answered && <td>
                            {!Array.isArray(exercise.givenAnswers) && (exercise.el.answers?.find(ans => ans.position === exercise.givenAnswers)?.text || '-')}
                            {Array.isArray(exercise.givenAnswers) && exercise.givenAnswers?.map(index => exercise.el.answers?.find(ans => ans.position === index)?.text).join(', ')}
                        </td>}
                        {review && <td>{exercise.el.review &&
                            <Button onClick={() => onOpenReviewHandler(exercise.el.review, exercise.index)}>
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    size="sm"
                                />
                            </Button>}
                        </td>}
                    </tr>)
                    }
                    </tbody>
                </table>
            </div>
            <Dialog
                ref={modalRef}
                yesTranslate={structureData.confirm}
                descriptionText={reviewModalOpen}
                onConfirmModal={onCloseReview}
            />
        </>
    );
};

export default SummaryDetailTable;
