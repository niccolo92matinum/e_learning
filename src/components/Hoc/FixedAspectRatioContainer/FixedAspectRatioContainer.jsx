import React, {useCallback, useEffect, useRef, useState} from "react";
import Radium from "radium";
import styles from "./FixedAspectRatioContainer.module.scss";
import {debounce} from "../../../utils";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 *
 * props.percentageContent stabilisce la percentuale che deve occupare il contenuto rispetto al contenitore. (default: 100)
 * props.width larghezza risoluzione da cui prendere le proporzioni (default: 1920)
 * props.height altezza risoluzione da cui prendere le proporzioni (default: 1080)
 * props.additionalHeight altezza da aggiungere per header e footer (default: 0)
 */

const FixedAspectRatioContainer = (props) => {
  const IMG_WIDTH = 1920;
  const IMG_HEIGHT = 1080;
  /* Serve? Allo stato attuale setta ma non utilizza
    let [mainHeight, setMainHeight] = useState(0);
    let [mainWidth, setMainWidth] = useState(0);
    */
  const componentElement = useRef(null);
  let [fixedAspectRatioBoxStyle, setFixedAspectRatioBoxStyle] = useState({});

  const resize = useCallback(()=>{

    const propRatio = (props.height || IMG_HEIGHT) / (props.width || IMG_WIDTH);

    if (!componentElement.current){
      return;
    }
    let containerWidth =
        (componentElement.current.clientWidth *
            (props.percentageContent || 100)) /
        100;

    // ignora percentageContent su mobile (< 1024px)
    if (componentElement.current.clientWidth < 1024){
      containerWidth = componentElement.current.clientWidth;
    }
    let containerHeight =
        containerWidth * propRatio + (props.additionalHeight || 0);

    /* se l'altezza calcolata del box supera il contenitore, fissa l'altezza e calcola la nuova larghezza */
    if (containerHeight > componentElement.current.clientHeight) {
      containerHeight = componentElement.current.clientHeight;
      containerWidth =
          (componentElement.current.clientHeight -
              (props.additionalHeight || 0)) /
          propRatio;
    }

    setFixedAspectRatioBoxStyle({
      width: containerWidth,
      height: containerHeight,
    });
  },[props.additionalHeight,props.height,props.width,props.percentageContent,componentElement.current]);

  useEffect(()=>{
    // all'apertura effettuo il primo resize per adattare la vista alla finestra
    setTimeout(()=>resize(), 200);
  },[resize])

  useEffect(() => {
    debounce(()=>resize());
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, [resize, props.additionalHeight, props.percentageContent]);

  return (
    <div
      className={[styles.FixedAspectRatioContainer, props.className].join(" ")}
      ref={componentElement}
    >
      <div className={styles["outer-box"]}>
        <div
          className={[
            styles["fixed-aspect-ratio-box"],
            props.shadow ? styles.shadow : "",
          ].join(" ")}
          style={fixedAspectRatioBoxStyle}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Radium(FixedAspectRatioContainer);
