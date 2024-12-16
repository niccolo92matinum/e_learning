import React from "react";
import styles from "./BigPlay.module.scss";

const BigPlay = (props) => {
  return (<button className={"bigPlayCustom " + styles.bigPlayCustom} onClick={props.onPlay}>
      {/* <img alt="play" src="./assets/player/playButton.svg"/> */}
      <span></span>
  </button>);
}

export default BigPlay;