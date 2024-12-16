import React from "react";
import styles from "./MenuIndex.module.scss";
import { Transition } from "react-transition-group";
import IndexItem from "./IndexItem/IndexItem";

const Index = (props) => {
  const duration = 1000;
  const ANIMATION_DURATION_MS = 10;

  const menuIndexStyle = {
    transition: `${duration}ms`,
  };

  const MenuIndexTransitionStyles = {
    entering: { transform: "translate(-100%)", zIndex: -1 },
    entered: { transform: "translate(0)" },
    exiting: { transform: "translate(0)" },
    exited: { transform: "translate(-100%)", zIndex: -1 },
  };
  // TODO: bloccare apertura prima pagina di una lezione se le precedenti lezioni non sono completate
  return (
    <Transition
      in={props.isIndexVisible}
      timeout={{ enter: ANIMATION_DURATION_MS, exit: ANIMATION_DURATION_MS }}
    >
      {(state) => (
        <div
          className={styles.MenuIndex}
          style={{ ...menuIndexStyle, ...MenuIndexTransitionStyles[state] }}
        >
          {(props.items?.lessons?.length > 0) && props.items.lessons.map((lesson, indexL) => {
            return (
              <div key={"kL_" + lesson.id} className={styles.lessonBlock}>
                <div className={styles.lessonTitle}>
                  {/* <span className={styles.lessonKey}>{indexL + 1}</span>{" "} */}
                  {lesson.title}
                </div>
                {lesson.pages.map((page, indexP) => (
                  <IndexItem
                    title={page.title}
                    viewed={page.viewed}
                    locked={props.restricted && page.locked}
                    visible={props.isIndexVisible}
                    active={page.active}
                    index={indexP + 1}
                    onClick={() => {
                      (!page.locked || !props.restricted) &&
                        props.onOpenPage(0, lesson.id, page.id);
                    }}
                    key={"kP" + lesson.id + "_" + page.id}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </Transition>
  );
};
export default Index;
