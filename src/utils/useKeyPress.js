import {useCallback, useEffect, useState} from "react";

export const useKeyPress = (targetKey) => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = useCallback(({ key, ctrlKey })=>{
    if (ctrlKey && key === targetKey) {
        setKeyPressed(true);
    }
  },[targetKey])
  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    // window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      // window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler]); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
};
