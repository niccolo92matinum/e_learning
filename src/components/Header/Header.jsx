import React, { useState, useEffect, useCallback } from "react";
import Logo from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronLeft,
  faChevronRight,
  faPlay,
  faPause,
  faRedo,
  faVolumeUp,
  faVolumeMute,
  faHouse,
  faDownload,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.scss";
import { noop } from "../../utils";
import LangSelector from "./LangSelector/LangSelector";
import FullscreenButton from "../FullscreenButton/FullscreenButton.jsx";
import { useSelector } from "react-redux";

const Header = (props) => {
  const {
    isNextCondition,
    onToggleIndex,
    isNavigationVisible,
    isFullscreenVisible,
    isIndexVisible,
    setIsDashboardVisible,
      showHomeButton,
      onToggleVideoMuted,
      videoMuted
  } = props;

  const structureData = useSelector((state) => state.structure.data);

  const [isBlockedNextPage, setIsBlockedNextPage] = useState(true);

  const [videoPaused, setVideoPaused] = useState(true);

  const onPlayPauseEventHandler = useCallback(() => {
    setVideoPaused(props.player.paused());
  }, [props.player]);

  useEffect(() => {
    props.player &&
      !props.player.isDisposed() &&
      setVideoPaused(props.player.paused());
  }, [props.player]);

  useEffect(() => {
    if (props.player && !props.player.isDisposed()) {
      /** Aggiorno gli state ogni volta che si verificano eventi play/pause */
      props.player.on("play", onPlayPauseEventHandler);
      props.player.on("pause", onPlayPauseEventHandler);
      props.player.on("canplaythrough", onPlayPauseEventHandler);
    }

    return () => {
      if (props.player && !props.player.isDisposed()) {
        props.player.off("play", onPlayPauseEventHandler);
        props.player.off("pause", onPlayPauseEventHandler);
        props.player.off("canplaythrough", onPlayPauseEventHandler);
      }
    };
  }, [onPlayPauseEventHandler, props.player]);

  useEffect(() => {
    if (!props.restricted) {
      setIsBlockedNextPage(false);
      return;
    }
    setIsBlockedNextPage(props.restricted && !props.isViewedPage);
  }, [isNextCondition, props.restricted, props.isViewedPage]);

  const toggleMuteVideoHandler = function () {
      onToggleVideoMuted();
  };

  const goToPrevious = () => {
    if (!props.hasPrev) {
      noop();
    } else {
      props.onPrevPage();
    }
  };

  const toggleIndexHandler = () => {
    // chiudo la trascrizione e la dashboard se aperte e apro l'indice
    if (!isIndexVisible && props.audioTranscriptionVisible) {
      props.onToggleAudioTranscription();
    }

    /*setIsDashboardVisible(false);*/

    // metto in pausa il video quando apro il menu se in play e viceversa
    onToggleIndex((prevState) => {
      return !prevState;
    });
  };

  const toggleAudioTranscriptionHandler = () => {
    // chiudo l'indice
    onToggleIndex(false);
    props.onToggleAudioTranscription();
  };

  /*  const toggleDashboardHandler = () => {
    setIsDashboardVisible((prevState) => {
      prevState ? props.player?.play() : props.player?.pause();
      return !prevState;
    });
  };*/

  const prevPageHandler = () => {
    setIsDashboardVisible(false);
    goToPrevious();
  };

  const nextPageHandler = () => {
    if (!isBlockedNextPage && props.currentPageIndex < props.totalPages) {
      setIsDashboardVisible(false);
      props.onNextPage();
    }
  };

  const navigationSection = <>
      <button className={'headerButton'} onClick={prevPageHandler} aria-label={structureData.prev}
              disabled={!props.hasPrev}>
          <FontAwesomeIcon
              icon={faChevronLeft}
              size="lg"
              className={[
                  styles.icon,
                  !props.hasPrev ? styles.disabledBtn : "",
              ].join(" ")}
          />
      </button>

    <div className={styles.positionPage}>
          {" "}
          {props.currentPageIndex} {props.translations.of} {props.totalPages}
      </div>

      <button className={`${styles.nextIcon} ${'headerButton'}`} onClick={nextPageHandler} aria-label={structureData.next}
              disabled={isBlockedNextPage || props.currentPageIndex >= props.totalPages}>
          <FontAwesomeIcon
              icon={faChevronRight}
              size="lg"
              className={[
                  styles.icon,
                  isBlockedNextPage || props.currentPageIndex >= props.totalPages
                      ? styles.disabledBtn
                      : "",
              ].join(" ")}
          />
          {!isBlockedNextPage &&
              props.currentPageIndex !== props.totalPages && (
                  <div className={styles.tooltipGoOn}>
                      {props.translations.tooltipNext}
                  </div>
              )}
      </button>
  </>

    useEffect(()=>{
        if (!props.player && props.audioTranscriptionVisible) {
            props.onToggleAudioTranscription();
        }
    },[props.player])

  return (
  <div className={styles.headerContainer}>
      <div>
          {/* INDICE*/}
          {props.isIndexEnabled && (
              <button className={'headerButton'} onClick={toggleIndexHandler} aria-label={structureData.index}>
                  <FontAwesomeIcon
                      icon={faBars}
                      size="lg"
                      className={styles.icon}
                  />
              </button>
          )}

          <div className={styles.logoContainer}>
              <Logo className={styles.logo}/>
          </div>
          <div className={styles.titlePage}>
              <h2>{props.title}</h2>
          </div>
      </div>
      <div>
          {props.pdfDocument && <button className={'headerButton'} onClick={() => {
              window.open(props.pdfDocument, "_blank");
          }}
                  aria-label={structureData.download}>
              <FontAwesomeIcon
                  icon={faDownload}
                  size="lg"
                  className={styles.icon}
              />
          </button>}
          {
              /* SELETTORE LINGUA */
              props.isLangSelectorEnabled && (
                  <LangSelector
                      languages={props.languages}
                      currentLang={props.currentLang}
                      onChangeCc={props.handleChangeCc}
                      onChangeLanguage={props.handleChangeLanguage}
                      vttLanguages={props.vttLanguages}
                      accessibleLabel={structureData.language}
                  />
              )
          }

          {props.player && (
              <button
                  className={`${styles.transcriptionIcon} ${'headerButton'}`}
                  onClick={toggleAudioTranscriptionHandler}
                  aria-label={structureData.transcription}
              >
                  <span>T</span>
              </button>
          )}

          {props.helpButtonVisible && (
              <button className={'headerButton'} onClick={props.toggleHelpPopup} aria-label={structureData.help}>
                  <FontAwesomeIcon
                      icon={faQuestion}
                      size="lg"
                      className={styles.icon}
                  ></FontAwesomeIcon>
              </button>
          )}
          {isFullscreenVisible && <FullscreenButton maximizableElement={props.maximizableElement} accessibleLabel={structureData.fullscreen}/>}

          {props.player && (
              <button className={'headerButton'} onClick={() => {
                  props.player.currentTime(0);
              }}
                      aria-label={structureData.repeat}>
                  <FontAwesomeIcon
                      icon={faRedo}
                      size="lg"
                      className={styles.icon}
                  />
              </button>
          )}
          {props.player && !videoPaused ? (
              <button className={'headerButton'} onClick={() => {
                  props.player.pause();
              }}
                      aria-label={structureData.pause}>
                  <FontAwesomeIcon
                      icon={faPause}
                      size="lg"
                      className={styles.icon}
                  />
              </button>
          ) : (
              props.player && (
                  <button className={'headerButton'} onClick={() => {
                      props.player.play();
                  }}
                          aria-label={structureData.play}>
                      <FontAwesomeIcon
                          icon={faPlay}
                          size="lg"
                          className={styles.icon}
                      />
                  </button>
              )
          )}

          { isNavigationVisible && (props.totalPages > 1) &&  navigationSection }

      {props.player && (
          <button className={'headerButton'} onClick={toggleMuteVideoHandler}
                  aria-label={videoMuted ? structureData.unmute : structureData.mute}>
              <FontAwesomeIcon
                  icon={videoMuted ? faVolumeMute : faVolumeUp}
                  size="lg"
                  className={styles.icon}
              />
          </button>
      )}

      {showHomeButton &&
          <button className={'headerButton'} onClick={props.onHomeClicked} aria-label={structureData.home}>
              <FontAwesomeIcon
                  icon={faHouse}
                  size="lg"
                  className={styles.icon}
              ></FontAwesomeIcon>
          </button>}

      {/*<div id={styles.dashboardPieIcon} onClick={toggleDashboardHandler}>
          <FontAwesomeIcon
            icon={faChartPie}
            size="lg"
            className={styles.icon}
          />
        </div>*/}
  </div>
  </div>
)
    ;
};

export default Header;
