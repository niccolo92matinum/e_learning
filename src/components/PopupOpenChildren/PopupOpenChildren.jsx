import styles from "./PopupOpenChildren.module.scss";
import CustomComponent from "../CustomComponent/CustomComponent";
import React, { useState } from "react";
import { Button } from "../Button/Button";

/**
 * Apre un popup con un pulsante al cui click si mette in pausa il video e viene mostrato il childrenComponent
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const PopupOpenChildren = (props) => {
  const [exerciseVisible, setExerciseVisible] = useState(false);

  const onClickOkHandler = () => {
    setExerciseVisible(true);

    // TODO: passare parametro props.onClickOkHandler
    //props.onClickOkHandler()

    //videoData.player.currentTime(30); // TODO: impostare da json timer a cui rimandare
  };

  return (
    <div className={styles.PopupOpenChildren}>
      {exerciseVisible ? (
        <CustomComponent
          {...props.innerComponent}
          tagComponent={props.innerComponent.tagComponent}
        />
      ) : (
        <div>
          <h1>popupcomponent</h1>
          <Button onClick={onClickOkHandler}>ok</Button>
        </div>
      )}
    </div>
  );
};
export default PopupOpenChildren;
