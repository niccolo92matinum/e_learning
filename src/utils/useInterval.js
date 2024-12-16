import { useEffect, useRef } from "react";
import * as workerTimers from 'worker-timers';

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const tick = () => {
    savedCallback.current();
  };
  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      let id = workerTimers.setInterval(tick, delay);
      return () => workerTimers.clearInterval(id);
    }
  }, [delay]);
}
