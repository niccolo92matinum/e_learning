import React, { useEffect, useMemo, useState } from "react";
import Spinner from "../Spinner/Spinner";
import styles from "./Learner.module.scss";
import videojs from "video.js";
import LandingPage from "../LandingPage/LandingPageOneLevel";
import FixedAspectRatioContainer from "../Hoc/FixedAspectRatioContainer/FixedAspectRatioContainer";
import Main from "../Main/Main";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import Header from "../Header/Header";
import log from "loglevel";
import ContentPage from "../Main/ContentPage";
import stateLms from "../../store/initial-state-lms.json";

import {
    areAllPagesViewed, buildFinalTestStr, canRetry, getBookmarkObj, getIndexItems,
    getScoCustomItem,
    getScormVersion, hasBookmark,
    isPageViewed, saveTestString, saveTrackingString,
    setScoCustomItem,
} from "../../lmsUtils/lms";
import { withScorm } from "../../utils/react-scorm-provider";
import Index from "../../utils/models/IndexItem";
import { isNil } from "ramda";
import { useSelector, useDispatch } from "react-redux";
import { courseActions } from "../../store/slices/courseSlice";
import { structureActions } from "../../store/slices/structureSlice";
import { lmsActions } from "../../store/slices/lmsSlice";
import {
    bookmarkActions,
    initTrackingThunk,
} from "../../store/slices/bookmarkSlice";
import { openPage } from "../../store/slices/courseSlice";
import { initTrackingStringFromstructure } from "../../lmsUtils/lms";
import BtnContinue from "../BtnContinue/BtnContinue";
import useErrorConnectionMessage from "../../utils/useErrorConnectionMessage";
import scormDataModel from "../../utils/scormDataModel";
import { useDisableDevtool } from "../../utils/useDisableDevtool.js";
import HelpPopup from "../HelpPopup/HelpPopup.jsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import getRetryCountFinalTest from "../../utils/getRetryCountFinalTest.js";
import {usePollingAliveConnection} from "../../utils/usePollingAliveConnection.js";

const Learner = (props) => {
  const dispatch = useDispatch();
  const courseData = useSelector((state) => state.course.data);
  const structureData = useSelector((state) => state.structure.data);

  const lmsData = useSelector((state) => state.lms.data);
  const bookmarkData = useSelector((state) => state.bookmark);

  const [playerEl, setPlayerEl] = useState(null);

  const isOnline = useErrorConnectionMessage();

  /**
   * Bookmark: se valorizzato una modale chiede all'utente se riprendere la fruzione dal bookmark
   */
  const [modalBookmarkVisible, setModalBookmarkVisible] = useState(false);

  /** Gestisco a questo livello la visibilità di index per fare il gioco di nasconderlo se faccio play del video ed è visibile */
  const [isIndexVisible, setIsIndexVisible] = useState(false);
  /** Gestisco a questo livello la visibilità del pannello dashboard per fare il gioco di nasconderlo se faccio play del video ed è visibile */
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);

  const [isVideoEnded, setIsVideoEnded] = useState(false);

  const [openedChild, setOpenedChild] = useState(null);

  const [helpPopupVisible, setHelpPopupVisible] = useState(false);


  /** chiamata polling al lms per tenere attiva la connessione */
  usePollingAliveConnection(props.sco, lmsData?.lms_polling_minutes);


  const maximizableElement = React.useRef(null); // per il fullscreen

  const onToggleIndex = (visible) => {
    setIsIndexVisible(visible);
  };

  /**
   * Apre la pagina
   *
   * @param m {string}: id modulo da aprire
   * @param l {string}: id lezione da aprire
   * @param p {string}: id pagina da aprire
   */
  const openPageHandler = (_structureData, m, l, p, isRestricted) => {
    if (!_structureData) {
      throw new Error("structureData is null! Cannot open any page.");
    }
    setIsIndexVisible(false);
    setIsVideoEnded(false);
    dispatch(
      openPage(
        m,
        l,
        p,
        getPageIndexInLesson({structureData: _structureData, lId: l, pId: p}),
        isRestricted
      )
    );

    let currentPage = _structureData?.pages[p];
    if (!currentPage.videoSrc) {
      if (!currentPage.childIds) {
        log.error(
          "Neither videoSrc nor childIds wasn't found in page! Please check the structure in json file."
        );
        return;
      }
      let tId = currentPage.childIds[0];
      setOpenedChild(_structureData?.timings[tId]);
      _structureData?.timings[tId].optional && trackChildComponentHandler();
    } else {
      setOpenedChild(null);
    }
  };

  const getFirstPage = (_structureData) => {
    let firstModule =
      _structureData.modules[Object.keys(_structureData.modules)[0]];
    let firstLesson = _structureData.lessons[firstModule.childIds[0]];
    let firstPage = _structureData.pages[firstLesson.childIds[0]];
    return { mId: firstModule.id, lId: firstLesson.id, pId: firstPage.id };
  };

  const isBtnContinueVisible = (isViewedPage) => {
    return (
      !openedChild &&
      currentPageIndex <
        structureData?.lessons[courseData?.currentPage.idLesson].childIds
          .length &&
      isVideoEnded &&
      isViewedPage
    );
  };

  /**
   * Apre la prima pagina del corso
   *
   * @param m {string}: id modulo da aprire
   * @param l {string}: id lezione da aprire
   * @param p {string}: id pagina da aprire
   */
  const openFirstPageHandler = (_structureData, isRestricted) => {
    if (!_structureData) {
      throw new Error("structureData is null! Cannot open any page.");
    }
    let firstIds = getFirstPage(_structureData);
    openPageHandler(
      _structureData,
      firstIds.mId,
      firstIds.lId,
      firstIds.pId,
      isRestricted
    );
  };
  const initStructureWithLang = async (lang, suffix) => {
    const data = await import(`../../store/${import.meta.env.VITE_DEV_LANG_FOLDER || 'lang'}/${lang}${suffix || ""}.json`);
    dispatch(structureActions.setStructure(data));
    return data;
  };

  useDisableDevtool(courseData?.disableDevtool);

  useEffect(() => {
    let data = stateLms;
    initStructureWithLang(props.currentLang, courseData?.suffixJsonToRead).then(
      (dataS) => {
          document.title = dataS.courseTitle;
        // se il tracciamento è abilitato, aspetto che le api siano connesse
        if (
          data?.tracking_enabled &&
          !courseData.isDebug &&
          !props.sco.apiConnected
        ) {
          return;
        }
        let recoveredTrackingString = getScoCustomItem(
          props.sco,
          data?.tracking_type === "suspend_data"
            ? scormDataModel[getScormVersion(props.sco)].suspend_data
            : scormDataModel[getScormVersion(props.sco)].lesson_location,
          courseData.isDebug
        );
        let recoveredCompleted = getScoCustomItem(
          props.sco,
          scormDataModel[getScormVersion(props.sco)].completion_status,
          courseData.isDebug
        );
        if (recoveredTrackingString) {
          dispatch(
            initTrackingThunk({ trackingString: recoveredTrackingString, passed: recoveredCompleted, completed: !!recoveredCompleted })
          );
          // se devo ripartire dal bookmark
          if (
            data.recover_state_on_reopen &&
            hasBookmark(recoveredTrackingString)
          ) {
            // se trovo bookmark diversa da 0 faccio apparire restoreModal (per riprendere dal bookmark)
            setModalBookmarkVisible(true);
          } else {
            !courseData.landingPageVisible &&
              openFirstPageHandler(dataS, courseData?.restricted);
          }
        } else {
          // inizializzo la stringa di tracciamento e il bookmark
          let trackingString = initTrackingStringFromstructure(
              {
                  modules: dataS.modules,
                  lessons: dataS.lessons,
                  pages: dataS.pages,
                  attempt: getRetryCountFinalTest(dataS)
              }
          );
          dispatch(initTrackingThunk({trackingString}));
          !courseData.landingPageVisible &&
            openFirstPageHandler(dataS, courseData?.restricted);
        }
      }
    );
    dispatch(lmsActions.initConfig({ data: data }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, props.sco]);

  useEffect(() => {
    if (!lmsData?.tracking_enabled || !bookmarkData.trackingString) {
      return;
    }
    saveTrackingString({trackingString: bookmarkData.trackingString, trackingType: lmsData?.tracking_type, sco: props.sco, isDebug: courseData?.isDebug});
  }, [dispatch, bookmarkData?.trackingString, lmsData, courseData?.isDebug, props.sco]);

  useEffect(() => {
    if (
      lmsData?.tracking_enabled &&
      !lmsData?.tracking_passed_failed &&
      areAllPagesViewed(bookmarkData.trackingString)
    ) {
      // se non devo tracciare passed/failed controllo se non trovo una pagina non vista (non trovo 0 in trackingString) per tracciare completed
      setScoCustomItem(
        props.sco,
        scormDataModel[getScormVersion(props.sco)]?.completion_status,
        "completed",
        courseData?.isDebug
      );
      // TODO: valutare passare da props.sco.setStatus e fare in modo che sia scormProvider a occuparsi di salvare lo stato alla chiusura (ScormProvider.js line:137)
      dispatch(bookmarkActions.updateStatus({ completed: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarkData?.trackingString]);

  // tracking assessment. TODO: Usare event handler al posto di useEffect
    useEffect(() => {
        if (!structureData || !bookmarkData?.finalTest?.arrayStates){
            return;
        }
        const trackingStr = buildFinalTestStr({
            codiceLo: structureData.codiceLo,
            arrayStates: bookmarkData.finalTest?.arrayStates,
            masteryScore: lmsData.mastery_score,
            attempt: bookmarkData.finalTest?.userAttempt,
            totalAttempt: bookmarkData.finalTest?.totalAttempt,
            extractedExercisesCount: bookmarkData.finalTest?.extractedQuestionsCount,
            exercisesTotalCount: bookmarkData.finalTest?.numQuestions,
            oldScore: bookmarkData.finalTest?.oldUserScore,
            score: bookmarkData.finalTest?.userScore,
            oldTrackingString: bookmarkData.trackingString,
            isFailed: bookmarkData.finalTest?.passed === "failed"
        });

        trackCompletionStatus({ passedStr: bookmarkData.finalTest?.passed });
        trackingStr && dispatch(bookmarkActions.setTrackingString(trackingStr)); // scrivo trackingString solo se non vuota (caso test/assessment)
    }, [bookmarkData?.finalTest, structureData]);

  const handleNextPage = () => {
    let currentPageIndex = getPageIndexInLesson({
            structureData,
            lId: courseData.currentPage.idLesson,
            pId: courseData.currentPage.idPage
        });
    let nextPageIndex = currentPageIndex;
    let lesson = structureData.lessons[courseData.currentPage.idLesson];
    if (currentPageIndex + 1 < lesson.childIds.length) {
      nextPageIndex = currentPageIndex + 1;
    }
    openPageHandler(
      structureData,
      courseData.currentPage.idModule,
      courseData.currentPage.idLesson,
      structureData.pages[lesson.childIds[nextPageIndex]].id,
      courseData?.restricted
    );
  };
  const handlePrevPage = () => {
    let currentPageIndex = getPageIndexInLesson({
            structureData,
            lId: courseData.currentPage.idLesson,
            pId: courseData.currentPage.idPage
        });
    let prevPageIndex = currentPageIndex;
    let lesson = structureData.lessons[courseData.currentPage.idLesson];
    if (currentPageIndex - 1 >= 0) {
      prevPageIndex = currentPageIndex - 1;
    }
    openPageHandler(
      structureData,
      courseData.currentPage.idModule,
      courseData.currentPage.idLesson,
      structureData.pages[lesson.childIds[prevPageIndex]].id,
      courseData?.restricted
    );
  };
  const handleToggleAudioTranscription = () => {
    dispatch(courseActions.toggleAudioTranscription());
  };

  const handleToggleVideoMuted = ()=>{
      dispatch(courseActions.toggleVideoMuted());
  }
  const handlePlayerReady = (player) => {
    setPlayerEl(player);
    if (!player) return;

    if (courseData?.lang.vttLang){
        handleChangeCc(courseData?.lang.vttLang);
    }

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      setPlayerEl(null);
      videojs.log("player will dispose");
    });
  };
  const openModuleHandler = (idModule) => {
    dispatch(courseActions.openModule(idModule));
  };
  const openLessonHandler = (idModule, idLesson) => {
    // non c'è openLesson in courseSlice perché dal secondo livello della pagina di lancio è necessario aprire sia lezione che pagina
    openPageHandler(
      structureData,
      idModule,
      idLesson,
      structureData.lessons[idLesson].childIds[0],
      courseData?.restricted
    );
  };
  const continueFromBookmarkHandler = () => {
    openPageHandler(
      structureData,
      ...getBookmarkObj(bookmarkData.trackingString),
      courseData?.restricted
    );
    setModalBookmarkVisible(false);
  };

  const getPageIndexInLesson = ({structureData, lId, pId}) => {
    return structureData.lessons[lId].childIds.indexOf(parseInt(pId));
  };

  const hasTimings = () => {
    return structureData?.pages[courseData?.currentPage.idPage].childIds
      ?.length;
  };

  const videoEndedHandler = (_ended, _idLesson, _idPage) => {
    if (!_ended) {
      setOpenedChild(null);
    } else {
      // aggiorno tracciamento solo se non ho figli
      if (!hasTimings()) {
          const pageIndex = getPageIndexInLesson({
              structureData,
              lId: _idLesson,
              pId: _idPage
          });
        // TODO: tracciare anche se i figli sono tutti facoltativi
        dispatch(
          bookmarkActions.setPageViewed({
            idLesson: _idLesson,
            idPage: _idPage,
            pageIndex,
          })
        );
      }

      if (courseData.autoNext && !hasTimings()) {
        handleNextPage();
      }

      // apri eventuali child settati con timing ended
      const timingIdsCurrentPage =
        structureData?.pages[courseData?.currentPage.idPage].childIds;
      timingIdsCurrentPage?.forEach((tId) => {
        if (structureData?.timings[tId].position === "end") {
          setOpenedChild(structureData?.timings[tId]);
          structureData?.timings[tId].optional && trackChildComponentHandler();
        }
      }); // viene considerato un solo timing end per pagina (se più di uno verrà aperto l'ultimo)
    }
    setIsVideoEnded(_ended);
  };

  const videoStartedHandler = () => {
    setIsVideoEnded(false);
  };

  const trackCompletionStatus = ({ passedStr })=>{

      if (lmsData?.tracking_passed_failed) {
          if (lmsData?.tracking_enabled){
              if (!courseData.isDebug && props.sco.scormVersion === "2004") {
                  props.sco.set("cmi.success_status", passedStr);
                  passedStr === "passed" &&
                  props.sco.set(scormDataModel[getScormVersion(props.sco)]?.completion_status, "completed"); // per scorm 2004 traccio completed solo quando è pure passed
              } else {
                  setScoCustomItem(
                      props.sco,
                      scormDataModel[getScormVersion(props.sco)]?.completion_status,
                      passedStr,
                      courseData.isDebug
                  );
              }
          }
      } else {
          // se ho impostato in initial-state-lms l'opzione per tracciare solo il completed quando supero il test (tracking_passed_failed)
          lmsData?.tracking_enabled && passedStr &&
          setScoCustomItem(
              props.sco,
              scormDataModel[getScormVersion(props.sco)]?.completion_status,
              "completed",
              courseData.isDebug
          );
      }
  }

  const trackChildComponentHandler = (finalTestStatus)=>{
      log.info("Status final test: ", finalTestStatus);
      if (finalTestStatus){

          let prevFinalScorePerc;
          prevFinalScorePerc = parseFloat(getScoCustomItem(props.sco, scormDataModel[getScormVersion(props.sco)]?.score_raw, courseData.isDebug)) || 0;
          let isCompleted = getScoCustomItem(props.sco, scormDataModel[getScormVersion(props.sco)]?.completion_status, courseData.isDebug) === "completed";

          // se trackUntilCompleted e già completato, non traccio più
          if (isCompleted && lmsData?.trackUntilCompleted){
              log.info("Tracciamento impostato per non sovrascrivere i risultati.");
              return;
          }

          if (lmsData?.tracking_enabled && finalTestStatus?.scorePerc >= prevFinalScorePerc) {
              log.info(
                  `Ottenuto punteggio del test più alto (${finalTestStatus?.scorePerc})! Sovrascrivo il vecchio valore (${prevFinalScorePerc})`
              );
              setScoCustomItem(
                  props.sco,
                  scormDataModel[getScormVersion(props.sco)].score_raw,
                  finalTestStatus?.scorePerc,
                  courseData.isDebug
              );

              if (!courseData.isDebug && props.sco.scormVersion === "2004") {
                  props.sco.set("cmi.score.min", 0);
                  props.sco.set("cmi.score.max", 100);
                  props.sco.set("cmi.score.raw", finalTestStatus?.scorePerc);
                  props.sco.set("cmi.score.scaled", finalTestStatus?.scorePerc / 100);
              }
          } else {
              log.info(
                  `Learner: Punteggio ottenuto è inferiore al punteggio tracciato in precedenza, mantengo il vecchio. Prev: ${prevFinalScorePerc}, new: ${finalTestStatus?.scorePerc}`
              );
          }
          lmsData?.tracking_passed_failed && dispatch(
              bookmarkActions.updateStatus({
                  passed: finalTestStatus.passed,
                  scorePerc: finalTestStatus.userScore
              })
          );
          // se c'è soglia di superamento, traccio passed/failed
          trackCompletionStatus({ passedStr: isNil(lmsData.mastery_score) ? null : finalTestStatus.passed });
      }

      // devo sbloccare la pagina solo se ho superato il test oppure o finito i tentativi
      if (!finalTestStatus || (finalTestStatus.passed === "passed" || !canRetry(bookmarkData?.trackingString))){
          dispatch(
              bookmarkActions.setPageViewed({
                  idLesson: courseData?.currentPage.idLesson,
                  idPage: courseData?.currentPage.idPage,
                  pageIndex: getPageIndexInLesson({
                      structureData,
                      lId: courseData?.currentPage.idLesson,
                      pId: courseData?.currentPage.idPage
                  }),
              })
          );
      }
  }

  const handleChangeCc = (lang) => {
    dispatch(courseActions?.setVttLang(lang));
  };
  const handleChangeLanguage = (small_title) => {
    dispatch(courseActions.setLang(small_title));
    initStructureWithLang(small_title, courseData?.suffixJsonToRead);
  };

  const currentPageIndex =
    structureData?.lessons[courseData?.currentPage.idLesson]?.childIds.indexOf(
      parseInt(courseData?.currentPage.idPage)
    ) + 1 || 0;

  const _getIndexItems = ()=> {
      return getIndexItems({
          trackingString: bookmarkData.trackingString,
          lessons: structureData?.lessons,
          pages: structureData?.pages,
          showAllLessons: courseData?.index.showAllLessons,
          idCurrentLesson: courseData?.currentPage.idLesson?.toString()
      })
  }

  const indexItems = useMemo(_getIndexItems, [
    bookmarkData.trackingString,
    structureData,
    courseData,
  ]);

  const handleToggleHelpPopup = () => {
    setHelpPopupVisible((value) => !value);
  };

  const renderMainContent = () => {
    const isViewedPage = courseData?.currentPage.idPage
      ? isPageViewed({
            trackingString: bookmarkData.trackingString,
            lessonId: courseData?.currentPage.idLesson,
            pageIndexInLesson: getPageIndexInLesson({
                    structureData,
                    lId: courseData?.currentPage.idLesson,
                    pId: courseData?.currentPage.idPage
                }
            )
      })
      : false;

    return !isNil(courseData?.currentPage.idPage) ? (
      <div ref={maximizableElement} className={["h100"].join(" ")}>
        <>
          <Header
            player={playerEl}
            title={structureData.pages[courseData.currentPage.idPage]?.title}
            showHomeButton={courseData.landingPageVisible}
            onHomeClicked={() => {
              setOpenedChild(null);
              dispatch(courseActions.openLandingPage());
              playerEl.pause();
            }}
            onToggleVideoMuted={handleToggleVideoMuted}
            videoMuted={courseData?.videoMuted}
            pdfDocument={structureData.pdfDocument}
            handleChangeCc={handleChangeCc}
            handleChangeLanguage={(_small_title)=> {
                setOpenedChild(null);
                handleChangeLanguage(_small_title);
            }}
            languages={courseData?.languages}
            vttLanguages={courseData?.vttLanguages}
            currentLang={props.currentLang}
            onToggleIndex={onToggleIndex}
            isIndexVisible={isIndexVisible}
            isFullscreenVisible={courseData?.fullscreen?.visible}
            isNavigationVisible={courseData?.pageNav?.visible}
            setIsDashboardVisible={setIsDashboardVisible}
            isIndexEnabled={courseData?.index.visible && (indexItems?.lessons?.length > 0)}
            isLangSelectorEnabled={courseData?.languages?.length > 0}
            restricted={courseData?.restricted}
            audioTranscriptionVisible={courseData?.audioTranscriptionVisible}
            hasPrev={currentPageIndex > 1}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onToggleAudioTranscription={handleToggleAudioTranscription}
            totalPages={
              structureData?.lessons[courseData?.currentPage.idLesson].childIds
                .length
            }
            translations={{
              tooltipNext: structureData.tooltip_next,
              of: structureData.of,
            }}
            isViewedPage={isViewedPage}
            currentPageIndex={currentPageIndex}
            helpButtonVisible={courseData?.help.visible}
            toggleHelpPopup={handleToggleHelpPopup}
            maximizableElement={maximizableElement}
          />

          <Main
            sco={props.sco}
            audioTranscriptionVisible={courseData?.audioTranscriptionVisible}
            audioTranscription={
              structureData.pages[courseData.currentPage.idPage]
                ?.audioTranscription
            }
            isIndexVisible={isIndexVisible}
            isDashboardVisible={isDashboardVisible}
            setIsDashboardVisible={setIsDashboardVisible}
            controlsVideoJs={courseData?.controlsVideoJs}
            indexItems={indexItems}
            restricted={courseData.restricted}
            onOpenPage={(m, l, p) => {
              openPageHandler(structureData, m, l, p, courseData.restricted);
            }}
          >
            <BtnContinue
              visible={isBtnContinueVisible(isViewedPage)}
              onButtonClick={handleNextPage}
            />
            {!modalBookmarkVisible && (
              <ContentPage
                currentSrc={
                  structureData?.pages[courseData.currentPage.idPage].videoSrc
                }
                currentVtt={
                  structureData?.pages[courseData.currentPage.idPage].videoVtt
                }
                pageId={courseData.currentPage.idPage}
                isVideoEnded={isVideoEnded}
                onVideoEnded={videoEndedHandler}
                onVideoStarted={videoStartedHandler}
                onTrackChildComponent={(arg) => trackChildComponentHandler(arg?.finalTestStatus)}
                isViewedPage={isViewedPage}
                onNextPage={handleNextPage}
                onPlayerReady={handlePlayerReady}
                openedChild={openedChild}
                childLength={
                  structureData.pages[courseData.currentPage.idPage]?.childIds
                    ?.length
                }
                currentLang={courseData.lang.currentLang}
                currentVttLang={courseData.lang.vttLang}
              />
            )}
          </Main>
        </>
      </div>
    ) : (
      <Spinner />
    );
  };

  return (
    <div className={styles.Learner}>
      {!isOnline && <ErrorMessage message={"Attenzione! La comunicazione con la piattaforma si è interrotta.<br />Si consiglia di chiudere il corso e riaprirlo dopo aver verificato la connessione di rete."} />}
      {helpPopupVisible && (
        <HelpPopup
          onClosePopup={() => {
            setHelpPopupVisible(false);
          }}
        ></HelpPopup>
      )}
      {courseData && structureData?.modules && lmsData ? (
        <>
          {modalBookmarkVisible ? (
            <ConfirmModal
              yesTranslate={structureData.yes}
              noTranslate={structureData.no}
              descriptionText={structureData.confirmBeginText}
              onNoClick={() => {
                setModalBookmarkVisible(false);
                !courseData.landingPageVisible &&
                  openFirstPageHandler(structureData, courseData?.restricted);
              }}
              onConfirmModal={continueFromBookmarkHandler}
            />
          ) : (
            <>
              <LandingPage
                closed={!courseData?.landingPageVisible}
                onOpenModule={openModuleHandler}
                onOpenLesson={openLessonHandler}
                restricted={courseData?.restricted}
                lastViewedIndex={
                  new Index(
                    lmsData.lastModule,
                    lmsData.lastLesson,
                    lmsData.lastPage
                  )
                }
              />
              {courseData?.layoutType === "LAYOUT_BOX" ? (
                <FixedAspectRatioContainer
                  height={720}
                  width={1280}
                  additionalHeight={58}
                  percentageContent={90}
                  shadow={false}
                >
                  {renderMainContent()}
                </FixedAspectRatioContainer>
              ) : (
                renderMainContent()
              )}
            </>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default withScorm()(Learner);
