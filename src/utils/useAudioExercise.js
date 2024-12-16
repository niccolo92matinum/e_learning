import {useEffect, useRef, useState} from "react";
import log from "loglevel";
import Sound from "react-sound";

const useAudioExercise = (preventAudio, exerciseViewed, exerciseConfirmed, exerciseCorrect, elements, feedbackHidden, currentLang, muted)=> {

    const audioCode = elements.audioQuestion;

    const [playStatus, setPlayStatus] = useState(Sound.status.STOPPED);
    const [src, setSrc] = useState(null);
    const questionPlayed = useRef(false); // per riprodurre l'audio della domanda solo la prima volta
    const [volume, setVolume] = useState(80);

    const stopAudioHandler = ()=>{
        setPlayStatus(Sound.status.STOPPED);
    }

    useEffect(() => {
        setVolume(muted ? 0 : 80);
    }, [muted]);

    useEffect(() => {
        if (preventAudio){
            setPlayStatus(Sound.status.STOPPED);
            return;
        }
        /** AUDIO DOMANDA ESERCIZIO */
        if (!exerciseConfirmed) {
            log.info("####  Exec: USE_EFFECT audio domanda esercizio")
            // pausa dell'eventuale vecchio audio
            setPlayStatus(Sound.status.STOPPED);
            if (questionPlayed.current) return; // eseguo l'audio della domanda solo la prima volta

            setSrc(`assets/audio/exercises/${currentLang}/${audioCode}.mp3`);
            questionPlayed.current = true;
            setPlayStatus(Sound.status.PLAYING);
        }else{
            /** AUDIO FEEDBACK ESERCIZIO */
            setPlayStatus(Sound.status.STOPPED);
            // se non si vuole mostrare il feedback non faccio partire l'audio relativo
            if (feedbackHidden) return;

            if (exerciseCorrect){
                setSrc(`assets/audio/exercises/${currentLang}/${audioCode}_ok.mp3`);
            }else if (!exerciseViewed){ // risposta sbagliata, ho ancora tentativi
                setSrc(`assets/audio/exercises/${currentLang}/${audioCode}_ko_retry.mp3`);
            }else { // risposta sbagliata, ho ancora tentativi
                setSrc(`assets/audio/exercises/${currentLang}/${audioCode}_ko.mp3`);
            }
            setPlayStatus(Sound.status.PLAYING);
        }

    }, [preventAudio, exerciseConfirmed, exerciseCorrect, feedbackHidden]);
    useEffect(() => {
        questionPlayed.current = false;
    }, [elements]);
    return [playStatus, src, stopAudioHandler, volume];

}

export default useAudioExercise;
