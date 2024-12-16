import {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
/**
 * Check if user has pressed ctrl + (given key)
 * @param {*} targetKey : key
 * @param {function} callback: funzione da richiamare alla pressione sul tasto targetKey
 * @returns boolean
 */
export const useKeyPressCallback = (targetKey, callback) => {
  const videoData = useSelector((state) => state.video);

  const downHandler = useCallback((e)=>{
    if ((e.keyCode === targetKey) && (document.activeElement.tagName.toLowerCase() !== "input")) {
      callback();
    }
  },[targetKey,callback])

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keyup", downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keyup", downHandler);
    };
  }, [downHandler,videoData?.player]);
  return null;
};
