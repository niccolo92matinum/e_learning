import {isNil} from "ramda";
import log from "loglevel";
import scormDataModel from "../utils/scormDataModel.js";

export const SRV_PREFIX = "**SRV**";
export const TEST_PREFIX = "**QMSTEST**";
const SRV_SEPARATOR = "*||*";

/**
 * lms.js contiene tutte le funzioni utils per leggere/scrivere/elaborare la stringa di tracciamento
 */


/**
 * Cerca nel tracciamento se la pagina è viewed
 *
 * @param trackingString (es. ID_MOD:ID_LEZ:ID_PAG/1:3:11111000|2:3:12000|/1:3 => BOOKMARK/ID_LES:BOOKMARK_PAGE_ID:VIWED_PAGES/TENTATIVI_TEST_FRUITI:TENTATIVI_TOTALI)
 * @param lessonId: id della lezione corrente
 * @param pageIndexInLesson: posizione pagina da verificare (lezione corrente)
 * @returns {boolean}
 */
export const isPageViewed = ({trackingString, lessonId, pageIndexInLesson}) => {
    switch (import.meta.env.VITE_TRACKING_MODE){
        case "test":
            return true;
        default:
            if (!trackingString?.length || !trackingString.split("/")[1].length) {
                return false;
            }
            let trackedLessons = trackingString.split("/")[1].split("|");
            let foundL = trackedLessons.find((l) => l.split(":")[0] === lessonId + "");
            return foundL.split(":")[2][pageIndexInLesson] === "1";
    }
};

export const buildFinalTestStr = ({codiceLo = 0, arrayStates, masteryScore = 0, attempt = 0, totalAttempt = 0, extractedExercisesCount, exercisesTotalCount, oldScore, score, oldTrackingString, isFailed})=>{
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
            let trackingString = "";
            if (oldTrackingString && isFailed && (!totalAttempt || attempt <= totalAttempt) && score < oldScore) {
                const POSITION_ATTEMPT = 7;
                let arrayTrackingValues = oldTrackingString.split(SRV_SEPARATOR);
                arrayTrackingValues[POSITION_ATTEMPT] = attempt;
                trackingString = arrayTrackingValues.join(SRV_SEPARATOR);
                return trackingString;
            }
            const exercises = arrayStates.map(item => item.el);
            try{
                if (isNil(codiceLo)){
                    throw new Error("codiceLo non presente in struttura!");
                }
                if (!exercises){
                    throw new Error("Exercises non trovato");
                }else{
                    /* Blocco codiceLO_codiceCategoria_codiceDomanda */
                    exercises.forEach((exercise, index) => {
                        if (!exercise.id){
                            throw new Error(`id exercise non trovato. Indice: ${index}`);
                        }
                        if (!exercise.groupId){
                            throw new Error(`groupId non trovato in exercise with id ${exercise.id}`);
                        }
                        trackingString += `${codiceLo}_${exercise.groupId}_${exercise.id}`;
                        if (index < exercises.length - 1) {
                            trackingString += "-";
                        }
                    })
                    trackingString += SRV_SEPARATOR;

                    let reviewedStr = "";
                    /* Blocco rispostaCorretta-rispostaData-OrdineDellePossibiliRisposte (es. 2-1-012|0_3-1_2-0123) */
                    arrayStates.forEach((exercise, index) => {
                        reviewedStr += exercise.reviewed ? "1" : "0";
                        let givenAnswersStr = "";
                        if (exercise.viewed){
                            givenAnswersStr = Array.isArray(exercise.givenAnswers) ? exercise.givenAnswers.join('_') : exercise.givenAnswers;
                        }else{
                            givenAnswersStr = 'N';
                        }

                        trackingString += `${exercise.el.answers.filter(answer => answer.correct).map(answer => answer.position).join('_')}-${givenAnswersStr}-${exercise.el.answers.map(ans => ans.position).join('')}`; // placeholder, verrà popolato alla fine dell'assessment
                        if (index < exercises.length - 1) {
                            trackingString += "|";
                        }
                    })
                    trackingString += SRV_SEPARATOR;

                    /* Blocco Numero domande totali *||* Numero domande estratte *||* Mastery_score *||* Score *||* numero tentativi previsti *||* numero tentativi effettuati *||* stringa gestione dei ripassi */
                    trackingString += exercisesTotalCount + SRV_SEPARATOR; // Blocco Numero domande totali
                    trackingString += extractedExercisesCount + SRV_SEPARATOR; // placeholder, verrà popolato alla fine dell'assessment :: Numero domande estratte
                    trackingString += masteryScore + SRV_SEPARATOR; // Mastery_score
                    trackingString += score + SRV_SEPARATOR; // placeholder, verrà popolato alla fine dell'assessment :: Score
                    trackingString += totalAttempt + SRV_SEPARATOR; // numero tentativi previsti
                    trackingString += attempt + SRV_SEPARATOR; // numero tentativi effettuati
                    trackingString += reviewedStr // review non aperta (0) :: stringa gestione dei ripassi
                }
            } catch (e){
                console.error("Error buildFinalTestStr assessment", e);
            }
            return ((masteryScore && masteryScore > 0) ? TEST_PREFIX : SRV_PREFIX ) + trackingString;
        default:
    }
}

/**
 * Restituisce la stringa di tracciamento iniziale (se si recupera qualcosa da suspendData non viene ripristinato in questa funzione)
 * @param modules
 * @param lessons
 * @param pages
 * @param attempt
 * @returns {string}
 */
export function initTrackingStringFromstructure({modules, lessons, pages, attempt = 0}) {
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test": {
            return ""; // nell'assessment non traccio all'inizio, ma in multipleStepTest
        }
        default: {
            let trackingString = `${Object.keys(modules)[0]}:${Object.keys(lessons)[0]}:${
                Object.keys(pages)[0]
            }/`; // es. 0:0:0/
            for (const l of Object.values(lessons)) {
                trackingString += `${l.id}:N:`;
                trackingString += "0".repeat(l.childIds?.length);
                trackingString += "|";
            }
            trackingString += "/0:" + attempt;
            return trackingString;
        }
    }
}

export function buildUpdatedBookmark({idLesson, idPage, bookmark, oldString}) {
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
            return oldString; // in assessment non vengono tracciate le pagine
        default:
            if (!isNil(idLesson) && !isNil(idPage) && !isNil(bookmark)) {
                if (!oldString) {
                    log.error("Si sta provando ad aggiornare la stringa prima dell'init. Verificare che le api scorm siano raggiunte correttamente. Al di fuori della piattaforma settare isDebug true.");
                }
                let oldLessonsTrack = oldString.split('/')[1];
                let oldAttemptsFinalTest = oldString.split('/')[2] || "";
                let lessonsTrack = "";
                oldLessonsTrack.split('|').forEach(l => { // ogni blocco lezione è di questo tipo ==> ID_LES:BOOKMARK:VIEWED_PAGES
                    if (l.length > 0) {
                        if (l.split(':')[0] === (idLesson + '')) {
                            lessonsTrack += `${idLesson}:${idPage}:${l.split(':')[2]}|`;
                        } else {
                            lessonsTrack += l + '|'; // mantengo il vecchio blocco di tracciamento per questa lezione
                        }
                    }
                })

                return `${bookmark}/${lessonsTrack}/${oldAttemptsFinalTest}`;
            }
    }
}

export const recoverAssessmentData = (trackingString)=>{
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
            const [block1, answers, totalAnswers, extractedAnswers, masteryScore, score, totalAttempt, madeAttempts] = trackingString.split(SRV_SEPARATOR);
            return {
                oldUserScore: score,
                userAttempt: madeAttempts,
                totalAttempt
            }
        default:
            return {
                oldUserScore: null,
                userAttempt: null,
                totalAttempt: null
            }
    }



}

/**
 *
 * @param trackingString
 * @param pageIndex
 * @returns {string}
 */
export function setPageViewedInString({trackingString, lessonId, pageId, pageIndexInLesson}){
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
            return trackingString; // modello tracciamento test non gestisce pagine viste, ma solo tracciamenti test
        default:

            if (!trackingString){
                throw new Error("trackingString non può essere null. Inizializzare con il caricamento della struttura.");
            }
            if (isNil(lessonId)){
                throw new Error("lessonId non può essere null. Controllare i parametri. Received: ", lessonId);
            }
            if (isNil(pageId)){
                throw new Error("pageId non può essere null. Controllare i parametri. Received: ", pageId);
            }
            const [bookmark, trackedValues, trackedAttemptFinalTest = ''] = trackingString.split('/');
            if (!trackedValues){
                throw new Error("Impossibile aggiornare tracciamento. Non è presente nessuna stringa. TrackingString: " + trackingString);
            }

            let updatedString = "";
            let lessonBlocks = trackedValues.split('|');
            lessonBlocks.forEach(block => {
                if (block.split(':')[0] === (lessonId + '')){
                    let pages = block.split(':')[2];
                    pages = pages.substring(0,pageIndexInLesson) + '1' + pages.substring(pageIndexInLesson+1); // imposto la pagina viewed
                    updatedString += `${lessonId}:${pageId}:${pages}|`;
                }else if(block.length > 0){
                    updatedString += block + '|';
                }
            })
            return `${bookmark}/${updatedString}/${trackedAttemptFinalTest}`;
    }
}

export function canRetry(trackingString){
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
            const [block1, answers, totalAnswers, extractedAnswers, masteryScore, score, totalAttempt, madeAttempts] = trackingString.split(SRV_SEPARATOR);
            return parseInt(madeAttempts) < parseInt(totalAttempt);
        default:
            if (!trackingString) {
                console.error('trackingString is empty in bookmarkSlice');
            }
            const [bookmark, trackingPages, attempts] = trackingString.split('/');
            const [userAttempts, maxAttempt] = attempts.split(':');
            if (maxAttempt > 0) {
                return trackingString && userAttempts < maxAttempt;
            }
            return true; // se attempt non è settato in multiple_step_test, posso riprovare infinite volte
    }
}

export function areAllPagesViewed(trackingString) {
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test": {
            return trackingString.indexOf(SRV_PREFIX) > 0 || trackingString.indexOf(TEST_PREFIX) > 0; // il separatore nell'assessment/survey viene scritto solo alla fine
        }
        default:
          if (!trackingString || trackingString.length < 1) {
            return false;
          }
          let outputTrackingString = trackingString; // es. 0:0:5/0:5:1111111|1:9:11|
          let lessonsStr = outputTrackingString.split("/")[1]; // es. "0:5:1111111|1:9:11"
          let lessonArray = lessonsStr.split("|"); // es. ["0:5:1111111", "1:9:11"]
          return !lessonArray.find(
            (l) => l.length > 0 && l.split(":")[2].indexOf("0") >= 0
          );
          }
}
export function hasBookmark(trackingString) {
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
            return false; // non gestisco bookmark in modello test finale
        default:
            return trackingString.split("/")[0].match(/[1-9]/g);
    }
}

export const recoverExercises = ({recoverTracking, exercises})=>{
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
            const [block1, answers, totalAnswers, extractedAnswers, masteryScore, score, totalAttempt, madeAttempts] = recoverTracking.split(SRV_SEPARATOR);
            const answersArray = answers.split('|'); // ["2-1-102", "0_3-1_2-0123"] // corretta-data-ordinerisposte
            const res = [];
            block1.split('-').map((question,index) => {
                const [rispostaCorretta, rispostaData, ordineRisposte] = answersArray[index].split('-');
                const [codiceLo, codiceCategoria, idDomanda] = question.split('_');
                const found = exercises.find(exercise => {
                    return exercise.id === idDomanda;
                })
                if (!found){
                    throw new Error(`Could not find exercise with id: ${idDomanda}`);
                }
                const orderedArrayAnswers = [];
                found.answers.forEach((answer,index) => {
                    orderedArrayAnswers[index] = {
                        ...found.answers[ordineRisposte.split('')[index]],
                        position: parseInt(ordineRisposte.split('')[index])
                    }
                })
                const reorderedEl = {...found, answers: orderedArrayAnswers};
                let givenAnswers = rispostaData.split('_').map(ans => parseInt(ans));
                givenAnswers = found.type === "exercise_single" ? givenAnswers[0] : givenAnswers;
                if (rispostaData === 'N'){ // se rispostaData === 'N' vuol dire che è scaduto il timer
                    givenAnswers = null;
                }
                res.push({index, confirmed: true, viewed: true, el: reorderedEl, correct: rispostaCorretta.split('_').sort().join('') === rispostaData.split('_').sort().join(''), givenAnswers});
            })
            return res;
        default:
            return null;
    }
}

export function getBookmarkObj(trackingString) {
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
            console.error("Per l'assessment non è previsto bookmark. Disabilitare recover_state_on_reopen in initial-state-lms.json");
        default:
            return trackingString.split("/")[0].split(":");
    }
}

export function getScormVersion(sco) {
  return sco.scormVersion || "1.2";
}

export function saveTrackingString({trackingString, trackingType, sco, isDebug}) {

    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
        default:
            setScoCustomItem(
                sco,
                trackingType === "suspend_data"
                    ? scormDataModel[getScormVersion(sco)].suspend_data
                    : scormDataModel[getScormVersion(sco)].lesson_location,
                trackingString,
                isDebug
            );
    }

}

export const saveTestString = ({trackingString, trackingType, sco, isDebug}) => {
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":{
            setScoCustomItem(
                sco,
                trackingType === "suspend_data"
                    ? scormDataModel[getScormVersion(sco)].suspend_data
                    : scormDataModel[getScormVersion(sco)].lesson_location,
                trackingString,
                isDebug
            );
        }
        default:
            // gli scorm default non tracciano test finale (solo pagine viste con "saveTrackingString")
            break;
    }
}

export const getIndexItems = ({trackingString, lessons, pages, showAllLessons, idCurrentLesson}) => {
    let arrayLessons = [];
    switch (import.meta.env.VITE_TRACKING_MODE) {
        case "test":
            // in assessment non serve indice perché ci sarà solo pagina con test finale
            break;
        default:
            if (
                trackingString &&
                lessons &&
                pages
            ) {
                let trackedLessons = trackingString.split("/")[1];
                let trackedLessonsArray = trackedLessons.split("|").filter((l) => !!l);
                let prevLessonViewed = null;
                trackedLessonsArray.forEach((lStr) => {
                    const [lessonId, bookmarkPageId, viewedPages] = lStr.split(":");
                    if (!lessons[lessonId]){
                        throw new Error("Lezione non trovata. Verifica che la stringa di tracciamento corrisponda alla struttura del corso. Tracking string => " + trackingString)
                    }
                    let lessonObj = {
                        id: lessonId,
                        title: lessons[lessonId].title,
                        pages: viewedPages.split("").map((el, indexPageInLesson) => {
                            let pageId =
                                lessons[lessonId].childIds[indexPageInLesson];
                            if (!pages[pageId]){
                                throw new Error("Pagina non trovata. Verifica che la stringa di tracciamento corrisponda alla struttura del corso. Tracking string => " + trackingString)
                            }
                            return {
                                id: pageId,
                                title: pages[pageId].title,
                                locked:
                                    (indexPageInLesson === 0 &&
                                        (prevLessonViewed || isNil(prevLessonViewed))) ||
                                    viewedPages[indexPageInLesson - 1] === "1"
                                        ? false
                                        : true,
                                active: bookmarkPageId !== "N" && bookmarkPageId === pageId,
                                viewed: viewedPages[indexPageInLesson] !== "0",
                            };
                        }),
                    };
                    prevLessonViewed = viewedPages.indexOf("0") < 0; // tengo traccia del viewed della lezione, per sapere se sbloccare la prima pagina della lezione successiva

                    // visualizzo nell'index solo la lezione corrente
                    if (
                        showAllLessons ||
                        lessonObj.id === idCurrentLesson
                    ) {
                        arrayLessons.push(lessonObj);
                    }
                });
            }
    }

    return { lessons: arrayLessons };
};


/**
 * Funzione da richiamare per tracciare manualmente suspendData.
 * Prova a scrivere in lms. Se non c'è connessione scorm scrive su localStorage (con isDebugMode: true)
 *
 * @param sco {object}
 * @param isDebugMode {boolean}
 * @param itemKey {string}
 * @param itemValue {string}
 * @constructor
 */
export function setScoCustomItem(sco, itemKey, itemValue, isDebugMode) {
    if (sco && sco.apiConnected) {
        sco.set(itemKey, itemValue);
    } else if (isDebugMode) {
        localStorage.setItem(itemKey, itemValue);
    }
}
/**
 * Funzione da richiamare per recuperare suspendData o lessonlocation (da scorm o localStorage)
 *
 * @param sco {object}
 * @param itemKey {string}
 * @param isDebugMode {boolean}
 * @constructor
 */
export function getScoCustomItem(sco, itemKey, isDebugMode) {
    if (sco && sco.apiConnected) {
        return sco.get(itemKey);
    } else if (isDebugMode) {
        return localStorage.getItem(itemKey);
    }
}
