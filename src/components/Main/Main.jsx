import React, { memo, useEffect, useRef } from "react";
import AudioTranscription from "../AudioTranscription/AudioTranscription";
import Radium from "radium";
import Index from "../MenuIndex/MenuIndex.jsx";
import gsap from "gsap";
import styles from "./Main.module.scss";
import { useSelector } from "react-redux";
const Main = (props) => {
  const { isIndexVisible } = props;
  const audioTranscriptionRef = useRef(null);

  const bookmarkData = useSelector((state) => state.bookmark);

  /*useEffect(() => {
    const tl = gsap.timeline();
    const lightSlideVideo = () => {
      tl.to("." + styles.Content, {
        left: props.audioTranscriptionVisible ? "25%" : "0",
        width: props.audioTranscriptionVisible ? "calc(100% - 25%)" : "100%",
      });
      tl.duration(1.5).play();
    };
    lightSlideVideo();
  }, [props.audioTranscriptionVisible]);*/

  const openPageHandler = (moduleId, lessonId, pageId) => {
    props.onOpenPage(moduleId, lessonId, pageId);
  };

  return (
    <div
      id="main"
      className={[
        styles.MainContent,
        !props.controlsVideoJs && styles.withFooter,
      ].join(" ")}
    >
      <AudioTranscription
        audioTranscription={props.audioTranscription}
        ref={audioTranscriptionRef}
        isOpen={props.audioTranscriptionVisible}
      />
      <div
        className={[
          styles.Content,
          props.audioTranscriptionVisible ? styles.isSidebarOpened : "",
        ].join(" ")}
      >
        {bookmarkData && (
          <Index
            isIndexVisible={isIndexVisible}
            items={props.indexItems}
            onOpenPage={openPageHandler}
            restricted={props.restricted}
          />
        )}
        {props.children}
      </div>
    </div>
  );
};

export default memo(Radium(Main));
