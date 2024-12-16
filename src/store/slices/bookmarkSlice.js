import { createSlice } from '@reduxjs/toolkit';
import {isNil} from "ramda";
import {buildUpdatedBookmark, recoverAssessmentData, setPageViewedInString} from "../../lmsUtils/lms.js";
/** esempio stringa tracciamento:
 *  ID_MOD:ID_LEZ:ID_PAG/1:3:11111000|2:3:12000|/1:10
 *
 *   ID_MOD:ID_LEZ:ID_PAG <== indica il bookmark globale (ultima pagina aperta prima della chiusura corso)
 *
 *  1:3:11111000|2:3:11000| === ID_LESSON:BOOKMARK_PAGE_ID:PAGES
 *  1: id lezione
 *  3: posizione ultima pagina aperta in quella lezione (se c'è pagina di lancio è l'utente può lasciare un bookmark diverso in ciascuna lezione)
 *  11111000: 1 indica pagina vista, 0 pagina non vista
 *
 *  1:10 (terzo blocco della stringa) indica quanti tentativi fruiti sul totale tentativi del test finale
 *
  */


/**
 * Traccia il bookmark e le pagine viste
 */
export const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState: {
        trackingString: null, // usata solo da default scorm (non assessment/survey)
        finalTest: {
            completed: false,
            passed: null,
            numQuestions: 0,
            extractedQuestionsCount: 0,
            masteryScore: 0,
            oldUserScore: 0,
            userScore: 0,
            userAttempt: 0,
            totalAttempt: 0
        }
    },
    reducers: {
        initTracking: (state, action) => {
            state.trackingString = action.payload.trackingString;
            state.finalTest.completed = action.payload.completed;
            state.finalTest.passed = action.payload.passed;
            const { oldUserScore, userAttempt, totalAttempt } = recoverAssessmentData(action.payload.trackingString);
            !isNil(oldUserScore) && (state.finalTest.oldUserScore = parseInt(oldUserScore));
            !isNil(userAttempt) && (state.finalTest.userAttempt = parseInt(userAttempt));
            !isNil(totalAttempt) && (state.finalTest.totalAttempt = parseInt(totalAttempt));
        },
        updateStatus: (state, action) => {
            if (!isNil(action.payload.passed)) {
                state.finalTest.passed = action.payload.passed;
            }
            if (!isNil(action.payload.completed)){
                state.finalTest.completed = action.payload.completed;
            }
        },
        /**
         * Traccia il bookmark modulo:lezione:pagina:componente (la pagina da ripristinare alla riapertura del corso)
         */
        updateBookmark: (state, action) => {
            state.trackingString = buildUpdatedBookmark({...action.payload, oldString: state.trackingString})
        },
        setPageViewed: (state, action) => {
            state.trackingString = setPageViewedInString({trackingString: state.trackingString, lessonId: action.payload.idLesson, pageId: action.payload.idPage, pageIndexInLesson: action.payload.pageIndex});
        },
        setTrackingString: (state, action) => {
            state.trackingString = action.payload;
        },
        updateFinalTest: (state, action) => {
            state.finalTest = {
                ...state.finalTest,
                ...action.payload.finalTest,
                oldUserScore: Math.max(action.payload.finalTest.userScore, state.finalTest.oldUserScore)
            }
        }
    },
})

/* Action Creator Thunks */
export const initTrackingThunk = ({trackingString, passed, completed}) => {
    return (dispatch) => {
        dispatch(bookmarkActions.initTracking({trackingString, passed, completed}));
    }
}

// Action creators are generated for each case reducer function
export const bookmarkActions = bookmarkSlice.actions

export default bookmarkSlice.reducer
