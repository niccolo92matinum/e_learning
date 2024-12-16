import React from "react";
import styles from "./Button.module.scss";

export const Button = (props) => {
  return (
    <button {...props} className={[styles.Button, props.className].join(" ")}>
      {props.children}
    </button>
  );
};
