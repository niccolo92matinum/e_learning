import useInterval from "./useInterval.js";
import scormDataModel from "./scormDataModel.js";
import log from "loglevel";

/**
 * Effettua il polling di una chiamata get in piattaforma per tenere attiva la connessione (che altrimenti si chiuderebbe in automatico dopo un po')
 *
 * @param sco
 * @param lmsPollingIntervalMin: indica ogni quanti minuti effettuare il check della connessione alle api scorm
 */
export function usePollingAliveConnection(sco, lmsPollingIntervalMin) {
    let pollingInterval = null;
    // se lmsPollingIntervalMin ha valore minore di un minuto, non faccio polling
    if (
        sco &&
        sco.apiConnected &&
        lmsPollingIntervalMin &&
        lmsPollingIntervalMin >= 1
    ) {
        pollingInterval = lmsPollingIntervalMin * 60 * 1000;
    }
    /** Polling per tenere viva la connessione */
    useInterval(() => {
        if (!pollingInterval) {
            return;
        }
        const _less_loc = sco.get(
            scormDataModel[getScormVersion(sco)].lesson_location
        );
        log.info("LMS Polling. Lesson_location:", _less_loc);
    }, pollingInterval);
}
