import React, { memo, useEffect, useState } from "react";
import styles from "./BtnContinue.module.scss";
import TransitionFadeInLeft from "../TransitionFadeInLeft/TransitionFadeInLeft";
import { debounce } from "../../utils.js";

/**
 * Button laterale per andare alla pagina successiva
 */
const BtnContinue = (props) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const goToNextPage = () => {
    setButtonClicked(true);
    props.onButtonClick();
  };

  // ogni volta che cambia lo stato, resetto buttonClicked
  useEffect(() => {
    setButtonClicked(false);
  }, [props.visible]);

  return (
    <TransitionFadeInLeft visible={!buttonClicked && props.visible}>
      <div className={styles.btnContinue} onClick={debounce(goToNextPage)}>
        CONTINUE
      </div>
    </TransitionFadeInLeft>
  );
};

export default BtnContinue;
