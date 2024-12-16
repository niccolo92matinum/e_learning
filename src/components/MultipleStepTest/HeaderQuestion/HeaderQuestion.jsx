import React from "react";
import styles from "./HeaderQuestion.module.scss";
import {useSelector} from "react-redux";
import {isNil} from "ramda";

const HeaderQuestion = ({questionsLenght, title, subtitle, currentQuestionIndex}) => {
    const structureData = useSelector((state) => state.structure.data);
  return (
    <div className={styles.HeaderQuestion}>
        {!isNil(currentQuestionIndex) && <div className={styles.questionCounter}>
            {structureData.question_count?.replace('{current}',currentQuestionIndex + 1).replace('{total}', questionsLenght)}
        </div>}
      <div
        style={{
          display: "flex",
          lineHeight: "20px",
          paddingBottom: "12px",
          alignItems: "center",
        }}
      >
        <div
          className={styles.questionTitle}
          dangerouslySetInnerHTML={{ __html: title }}
        ></div>
      </div>
      {subtitle && (
        <div
          className={styles.questionSubtitle}
          dangerouslySetInnerHTML={{ __html: subtitle }}
        ></div>
      )}
    </div>
  );
};

export default HeaderQuestion;
