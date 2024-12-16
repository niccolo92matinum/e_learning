import {useEffect, useState} from "react";
import log from "loglevel";
const useSessionTimeTracker = (sco)=>{
    const [timer, setTimer] = useState("00:00:00");
    const [intervalId, setIntervalId] = useState(null);

    const getHours = (time) => {
        var hours = time.split(':')[0];
        return hours;
    }
    const getMinutes = (time) => {
        var minutes = time.split(':')[1];
        return minutes;
    }
    const getSeconds = (time) => {
        var seconds = time.split(':')[2];
        return seconds;
    }
    // resetto il timer
    const reset = () => {
        return setTimer('00:00:00');
    }
    // fixo i numeri al di sotto di 10 con 2 digits
    const pad2 = (number) => {
        return (number < 10 ? '0' : '') + number;
    }

    let setSessionTimerFn = (e)=>{
        log.info("tracking session_time", timer);
        sco.set("cmi.core.session_time", timer);
        setIntervalId(intervalId => clearInterval(intervalId))
    }

    useEffect(()=>{

        //window.addEventListener('beforeunload', setSessionTimerFn);

        setIntervalId(setInterval(()=>{
            setTimer(prevTimer => {
                let ore = getHours(prevTimer);
                let minuti = getMinutes(prevTimer);
                let secondi = getSeconds(prevTimer);

                // aumento i secondi
                secondi = pad2((Number(secondi) + 1));

                // se i secondi raggiungono il 60
                // aumento di 1 il minuto e riazzero i secondi
                if (secondi == 60) {
                    secondi = '00';
                    minuti = pad2((Number(minuti) + 1));
                }

                // se i minuti raggiungono il 60
                // aumento di 1 le ore e riazzero i minuti
                if (minuti == 60) {
                    minuti = '00';
                    ore = pad2((Number(ore) + 1));
                }

                let newTimer = ore + ":" + minuti + ":" + secondi;
                log.info("tracking session_time interval", newTimer);
                // setto la nuova ora
                return newTimer;
            })


        }, 1000))

        return () => {
            setIntervalId(intervalId => clearInterval(intervalId))
            //window.removeEventListener('beforeunload', setSessionTimerFn);
        };
    },[])

    return {timer, setSessionTimerFn};
}

export default useSessionTimeTracker;