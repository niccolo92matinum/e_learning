import React, { useRef, useState } from "react";
import CustomComponent from "../CustomComponent/CustomComponent";
import MultipleStepTest from "../MultipleStepTest/MultipleStepTest";
import styles from "./ChildrenPage.module.scss";
import GoNextPage from "../GoNextPage/GoNextPage";
import NonEvaluativeTest from "../MultipleStepTest/NonEvaluativeTest";

const ChildrenPage = (props) => {
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  const childrenElRef = useRef(null);

  const haveNext = () => {
    return currentChildIndex + 1 <= props.childrenCount - 1;
  };

  const onGoNext = () => {
    if (haveNext()) {
      setCurrentChildIndex((currentChildIndex) => currentChildIndex + 1);
    }
  };

  const renderChildren = () => {
    let componentToShow;

    if (props?.component?.type === "multiple_step_test") {
      componentToShow = (
        <MultipleStepTest
          key={`mst_${props.pageId}`}
          childIndex={currentChildIndex}
          test={props.component}
          onTrackViewedComponent={props.onTrackChildComponent}
          currentLang={props.currentLang}
          muted={props.muted}
        />
      );
    }

    if (props?.component?.type === "non_evaluative_test") {
      componentToShow = (
        <NonEvaluativeTest
          key={`net_${props.pageId}`}
          childIndex={currentChildIndex}
          test={props.component}
          onTrackViewedComponent={props.onTrackChildComponent}
          currentLang={props.currentLang}
          muted={props.muted}
        />
      );
    }

    if (props?.component?.type === "next_page") {
      componentToShow = <GoNextPage onNext={props.goNextPage} />;
    }
    if (props?.component?.type === "custom") {
      componentToShow = (
        <CustomComponent
          propsComponent={props.component.props}
          {...props.component.props}
          tagComponent={props.component.tagComponent}
          onNext={onGoNext}
          onTrackViewedComponent={props.onTrackChildComponent}
        />
      );
    }
    return (
      <div className={styles.classContainerChildren}>
        {componentToShow}
        {/** Solo se non ho timing gestisco in next component 
            !props.timing && 
            <div className={styles.nextBtnContainer}>
                <Button onClick={onGoNext}>next component</Button>
            </div>
            */}
      </div>
    );
  };

  return (
    <div className={styles.ChildrenPage} ref={childrenElRef}>
      {/*<div onClick={() => {childrenElRef.current.remove()}}> CLOSE} </div>*/}
      {renderChildren()}
    </div>
  );
};

export default ChildrenPage;
