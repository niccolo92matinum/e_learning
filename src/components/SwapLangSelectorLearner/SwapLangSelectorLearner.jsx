import { useDispatch, useSelector } from "react-redux";
import Multilanguage from "../Multilanguage/Multilanguage.jsx";
import Learner from "../Learner/Learner.jsx";
import React, { useEffect } from "react";
import stateCourse from "../../store/initial-state-course.json";
import { courseActions } from "../../store/slices/courseSlice.js";
import LoadingIcon from "../LoadingIcon/LoadingIcon.jsx";
import useLicenseScorm from "../../utils/useLicense.js";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";

/**
 * Hoc usato per switchare tra componente Multilanguage e Learner, in base ai parametri lingua in initial-state-course.json
 * @constructor
 */
const SwapLangSelectorLearner = () => {
  const dispatch = useDispatch();
  const courseData = useSelector((state) => state.course.data);

  const { error: errorLicense, isFetching: isFetchingLicense, isLicenseValid } = useLicenseScorm();

  useEffect(() => {
    let dataC = stateCourse;
    dispatch(courseActions.initConfig(dataC));
  }, [stateCourse]);

  if (isFetchingLicense) {
      return <LoadingIcon/>
  }
  if (isLicenseValid) {
      return courseData && !courseData.lang.currentLang ? (
          <Multilanguage
              languages={courseData?.languages}
              setLang={(smallTitleLang) => {
                  dispatch(courseActions?.setLang(smallTitleLang));
              }}
          />
      ) : courseData && courseData.lang.currentLang && (
          <Learner currentLang={courseData.lang.currentLang} key={courseData.lang.currentLang}/>
      )
  }else{
      return <ErrorMessage message={errorLicense?.message} />
  }


};

export default SwapLangSelectorLearner;
