import {useRef, useState} from 'react';

const useCountdownTimer = (_initialTimer)=>{
    _initialTimer = parseInt(_initialTimer);
    const initialDateTime = useRef();
    const [timer, setTimer] = useState(_initialTimer);
    const [intervalId, setIntervalId] = useState(null);
    const [timeIsRunning, setTimeIsRunning] = useState(false);
    const [timeOver, setTimeOver] = useState(false);

    const updateTimerHandler = ()=>{
        const elapsed = (new Date()).getTime() - initialDateTime.current;
        const updatedTimer = _initialTimer - elapsed;
        if (updatedTimer > 1) {
            setTimer(updatedTimer);
        }else{
            setTimer(0);
            intervalId && clearInterval(intervalId);
            setTimeOver(true);
            setTimeIsRunning(false);
        }
    }

    const startTimerHandler = ()=>{
        setTimer(_initialTimer);
        intervalId && clearInterval(intervalId);
        initialDateTime.current = (new Date()).getTime();
        setTimeOver(false);
        const _intervalId = setInterval(()=>{
            updateTimerHandler();
        },500);
        setTimeIsRunning(true);
        setIntervalId(_intervalId);
    }

    const stopTimerHandler = ()=>{
        intervalId && clearInterval(intervalId);
    }

    return {
        timer: timer,
        initialTimer: _initialTimer,
        elapsedTime: _initialTimer - timer,
        intervalId: intervalId,
        timeIsRunning: timeIsRunning,
        timeOver,
        reduceTimer: updateTimerHandler,
        startTimer: startTimerHandler,
        stopTimer: stopTimerHandler
    };
}

export default useCountdownTimer;
