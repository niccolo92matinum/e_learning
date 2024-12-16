import React, { useContext } from "react";
import styles from "./Multilanguage.module.scss";
import log from "loglevel";

const Multilanguage = ({languages, setLang}) => {
  if (languages.length < 1) log.error("Array of languages in initial-state-course is empty!");
  return (
    <div className={styles.containerMultilanguage}>
      {languages.map((lang, i) => {
        return (
          <div
            key={"language_" + i}
            onClick={() => setLang(lang.small_title)}
          >
            <img alt="" style={{ width: "60px" }} src={lang.img} />
            <div>{lang.long_title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Multilanguage;
