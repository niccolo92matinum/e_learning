import React, { useEffect, useRef, useState } from "react";
import styles from "./Popup.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import videojs from "video.js";
import log from "loglevel";
import { useKeyPressCallback } from "../../utils/useKeyPressCallback";
import FixedAspectRatioContainer from "../Hoc/FixedAspectRatioContainer/FixedAspectRatioContainer.jsx";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 *
 * Esempio componente:
 * {
     "id": "",
     "type": "custom",
     "tagComponent": "approfondimenti",
     "props": {
     "positionType": "flex",
     "detailed": [
         {
             "coords": {
                 "width": "23%",
                 "height": "38%",
                 "left": "25%",
                 "top": "45%"
            },
             "popupType": "video",
             "props": {
                 "title": "Procedure operative",
                 "src": "07_02"
             }
         }
     ]
    }
 * }
 */

// FIXME componente non funzionante
const ApproVideo = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const [previousTime, setPreviousTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekStart, setSeekStart] = useState(null);

  const KEYCODE_ESC = 27;
  useKeyPressCallback(KEYCODE_ESC, props.onClosePopup);

  const defaultPlayerOptions = {
    autoplay: true,
    controls: true,
    muted: false,
    preload: "auto",
    aspectRatio: "16:9",
    fluid: true,
    mobileView: false,
    playsinline: true,
    nodownload: true,
    noremoteplayback: true,
  };

  const onTimeUpdate = () => {
    setPreviousTime(currentTime);
    setCurrentTime(playerRef.current.currentTime());
  };
  const onSeeking = () => {
    if (seekStart === null) {
      setSeekStart(previousTime);
    }
  };
  const onSeeked = () => {
    if (currentTime > seekStart) {
      playerRef.current.currentTime(seekStart);
      log.info("%c ***seekStart:", "color: green", seekStart);
    }
    setSeekStart(null);
  };

  const addPlayerListeners = () => {
    if (!playerRef.current) {
      return;
    }
    if (props.restricted) {
      playerRef.current.on("timeupdate", onTimeUpdate);
      playerRef.current.on("seeking", onSeeking);
      playerRef.current.on("seeked", onSeeked);
    }
  };
  const removePlayerListeners = () => {
    if (!playerRef.current) {
      return;
    }
    playerRef.current.off("timeupdate", onTimeUpdate);
    playerRef.current.off("seeking", onSeeking);
    playerRef.current.off("seeked", onSeeked);
  };

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);
      const extendedOptions = {
        ...defaultPlayerOptions,
        ...props.playerOptions,
        controls: false,
        playsinline: true,
      };

      playerRef.current = videojs(videoElement, defaultPlayerOptions, () => {
        videojs.log("player is ready");
        playerRef.current?.src("./assets/video/it/" + props.src + ".mp4");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, videoRef]);

  useEffect(() => {
    if (playerRef.current) {
      addPlayerListeners();
    }
    return () => {
      removePlayerListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerRef.current, props.restricted]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div className={styles.PopupVideo}>
      <div className={styles.header}>
        <span>{props.title}</span>
        <FontAwesomeIcon
          icon={faTimes}
          size="lg"
          className={"clickable"}
          onClick={() => {
            props.onClosePopup();
          }}
        />
      </div>
      <div className={styles.content}>
        <FixedAspectRatioContainer>
          <div
            data-vjs-player
            id="appro-player-js"
            className={`${styles.videoJs} vjs-default-skin`}
          >
            <div ref={videoRef}></div>
          </div>
        </FixedAspectRatioContainer>
      </div>
    </div>
  );
};
export default ApproVideo;
