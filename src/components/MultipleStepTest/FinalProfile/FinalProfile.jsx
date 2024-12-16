import React from "react";
import styles from "./FinalProfile.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { courseActions } from "../../../store/slices/courseSlice";
import { Button } from "../../Button/Button.jsx";

function FinalProfile(props) {
  const { maxScore, score, resetTest, showAnswers, canRetry, children } = props;
  const dispatch = useDispatch();

  const lmsData = useSelector((state) => state.lms.data);

  const structureData = useSelector((state) => state.structure.data);

  const percScore = (score * 100) / maxScore;
  const passed = percScore >= lmsData.mastery_score;

  return (
    <div className={styles.finalProfileContainer}>
      {passed ? (
        <span className={[styles.green, styles.fa].join(" ")}>
          <i className={"fa fa-check-circle"} />
        </span>
      ) : (
        <span className={[styles.red, styles.fa].join(" ")}>
          <i className="fa fa-times-circle" />
        </span>
      )}
      <h3>{!passed ? structureData.finalProfileResult_ko : structureData.finalProfileResult_ok}</h3>
      <h4 dangerouslySetInnerHTML={{ __html: structureData.totalScore.replace('[[]]',Math.ceil(percScore)) }}></h4>
      {children && props.showReview && <h4 dangerouslySetInnerHTML={{ __html: structureData.reviewDescription }}></h4>}
      {!passed && canRetry && (
        <div
          className={styles.btnRetryTest}
          onClick={() => {
            dispatch(courseActions.setCurrentExerciseIdx(0));
            resetTest();
          }}
        >
          {structureData.retry} <i className="fa fa-repeat" />
        </div>
      )}
        { children }
        { !canRetry && <Button onClick={showAnswers}>
            {structureData.showSolutions}
      </Button>}
    </div>
  );
}

export default FinalProfile;
