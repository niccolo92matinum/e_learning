import React from "react";
import styles from "./LangDropdown.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { courseActions } from "../../../store/slices/courseSlice";

const LangDropdown = () => {
  const dispatch = useDispatch();
  const courseData = useSelector((state) => state.course.data);

  return (
    <div className={styles.langDropdown}>
      {courseData.lang.currentLang}

      <div>
        <ul>
          {courseData.languages.map((lang) => {
            return (
              <li
                key={lang.small_title}
                onClick={() =>
                  dispatch(courseActions.setLang(lang.small_title))
                }
                className={
                  lang.small_title === courseData.currentLang
                    ? styles.active
                    : ""
                }
              >
                {lang.small_title}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LangDropdown;
