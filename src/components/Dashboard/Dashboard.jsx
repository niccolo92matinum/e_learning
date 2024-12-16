import React, { useCallback, useEffect, useState } from "react";
import { Transition } from "react-transition-group";
import Doughnut from "../Charts/Doughnut/Doughnut";
import TropySvg from "../../assets/images/trophy.svg";
import styles from "./Dashboard.module.scss";
import gsap from "gsap";
import {useSelector} from "react-redux";

const Dashboard = (props) => {
  const [objStatistics, setObjStatistics] = useState({
    modules: [],
    totalPages: 0,
    totalViewed: 0,
    totalExercises: 0,
    exercisesDone: 0,
    scoreDone: 0,
    maxScore: 0,
  });
  const lmsData = useSelector((state) => state.lms.data);

  const structureData = useSelector((state) => state.structure.data);

  const ANIMATION_DURATION_MS = 1000;

  // se faccio resize per evitare il problema della finestra dashboard che si dimezza la chiudo
  const handleResize = useCallback(() => {
    if (props.isDashboardVisible) {
      props.setIsDashboardVisible(false);
    }
  },[props]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [handleResize, props.isDashboardVisible]);

  const dashboardStyle = {
    transform: "translateY(-100%)",
  };

  const calculateMaxScore = useCallback(() => {
    let maxScore = 0;
    Object.assign(
      {},
      ...(function _flatten(o) {
        return [].concat(
          ...Object.keys(o).map((k) => {
            if (typeof o[k] === "object") {
              _flatten(o[k]);
            } else if (k === "score") {
              return (maxScore += o[k]);
            }
            return null;
          })
        );
      })(structureData)
    );
    return maxScore;
  }, [structureData]);
  /** Statistiche senza tracciamento
   * Calcolo sulla base dei last index quindi se non è restricted la pagina
   * le statistiche possono essere non veritiere = posso non aver relamente visto tutte le pagine precedenti
   */
  const calculateSimpleStatistics = useCallback(() => {
    const maxScore = calculateMaxScore();

    const newObjStatistics = {
      modules: [],
      totalPages: 0,
      totalViewed: 0,
      totalExercises: 0,
      exercisesDone: 0,
      scoreDone: sessionStorage.getItem("score"),
      maxScore: maxScore,
    };
    for (let m = 0; m < structureData.modules.length; m++) {
      const currentM = structureData.modules[m];
      const newLesson = [];
      for (let l = 0; l < currentM.lessons.length; l++) {
        const currentL = currentM.lessons[l];
        let currentLessonTotalPages = 0;
        let currentLessonViewedPages = 0;

        for (let p = 0; p < currentL.pages.length; p++) {
          // const currentP = currentL.pages[p];
          currentLessonTotalPages += 1;
          newObjStatistics.totalPages += 1;

          /*if (m < lmsData.lastModule) { //TODO: non esiste più lastModule, lastLesson... usare lesson.viewed, page.viewed ecc..
            // se sto considerando il modulo e lezioni precedenti ritengo le pagine precedenti viste
            newObjStatistics.totalViewed += 1;
            currentLessonViewedPages += 1;
          } else if (l < lmsData.lastLesson) {
            newObjStatistics.totalViewed += 1;
            currentLessonViewedPages += 1;
          } else if (
            m === lmsData.lastModule &&
            l === lmsData.lastLesson &&
            p <= lmsData.lastPage
          ) {
            newObjStatistics.totalViewed += 1;
            currentLessonViewedPages += 1;
          }*/
        }
        newLesson.push({
          totalPages: currentLessonTotalPages,
          totalViewed: currentLessonViewedPages,
          totalPercentage: currentLessonViewedPages
            ? Math.round(
                (currentLessonViewedPages * 100) / currentLessonTotalPages
              )
            : 0,
        });
      }
      newObjStatistics.modules.push(newLesson);
    }
    setObjStatistics(newObjStatistics);
  }, [calculateMaxScore, /*lmsData.lastLesson, lmsData.lastModule, lmsData.lastPage,*/ structureData.modules]);

  /** Calcolo statistiche */
  useEffect(() => {

    /** Statistiche con tracciamento */
    const calculateStatisticsWithTracking = () => {
      const maxScore = calculateMaxScore();
      const newObjStatistics = {
        modules: [],
        totalPages: 0,
        totalViewed: 0,
        totalExercises: 0,
        exercisesDone: 0,
        scoreDone: 0,
        maxScore: maxScore,
      };

      for (let m = 0; m < lmsData.arrayBookmark.modules.length; m++) {
        const newLesson = [];
        const currentM = lmsData.arrayBookmark.modules[m];
        for (let l = 0; l < currentM.lessons.length; l++) {
          const currentL = currentM.lessons[l];
          let currentLessonTotalPages = 0;
          let currentLessonViewedPages = 0;
          for (let p = 0; p < currentL.pages.length; p++) {
            const currentP = currentL.pages[p];
            currentLessonTotalPages += 1;
            newObjStatistics.totalPages += 1;
            if (currentP.viewed === 1) {
              newObjStatistics.totalViewed += 1;
              currentLessonViewedPages += 1;
            }
            for (let co = 0; co < currentP.components.length; co++) {
              const currentComp = currentP.components[co];
              for (let ex = 0; ex < currentComp.exercises.length; ex++) {
                const currentEx = currentComp.exercises[ex];
                newObjStatistics.totalExercises += 1;
                if (currentEx.viewed === 1) {
                  newObjStatistics.exercisesDone += 1;
                }
                if (currentEx.score) {
                  newObjStatistics.scoreDone += currentEx.score;
                }
              }
            }
          }
          newLesson.push({
            totalPages: currentLessonTotalPages,
            totalViewed: currentLessonViewedPages,
            totalPercentage: currentLessonViewedPages
                ? Math.round(
                    (currentLessonViewedPages * 100) / currentLessonTotalPages
                )
                : 0,
          });
        }
        newObjStatistics.modules.push(newLesson);
      }
      setObjStatistics(newObjStatistics);
    };


    // se non visualizzo la dashboar faccio a meno di fare calcoli
    if (!props.isDashboardVisible) return;

    if (!lmsData?.arrayBookmark?.modules) {
      //in caso di non tracciamento
      calculateSimpleStatistics();
    } else {
      //in caso di tracciamento
      calculateStatisticsWithTracking();
    }
  }, [calculateMaxScore, calculateSimpleStatistics, lmsData?.arrayBookmark?.modules, props.isDashboardVisible]);

  let tl = gsap.timeline();

  const handleEnterAnimation = (node, isAppearing) => {
    tl.to("." + styles.dashboardContainer, {
      yPercent: 100,
      zIndex: 999,
      duration: ANIMATION_DURATION_MS / 1000,
      transform: "translate(0, -" + node.offsetHeight + "px)",
      ease: "power2",
    });
    tl.to(
      "." + styles.cardChart,
      {
        scale: 1,
        duration: 0.3,
        opacity: 1,
        stagger: {
          each: 0.1,
        },
      },
      "+0.2"
    );
    tl.from(
      "svg circle:nth-of-type(2)",
      {
        strokeDashoffset: 500,
        stagger: {
          each: 0.1,
        },
        duration: ANIMATION_DURATION_MS / 1000,
      },
      "0"
    );
    /*
    Non funziona correttamente
    tl.from(
      "." + styles.progress,
      {
        width: 0,
        stagger: {
          each: 0.1,
        },
        duration: 1,
      },
      "0"
    );
    */
  };
  const handleExitAnimation = (node, isAppearing) => {
    tl.to("." + styles.dashboardContainer, {
      yPercent: 0,
      ease: "power2",
    });
    tl.set("." + styles.cardChart, {
      scale: 0.8,
      opacity: 0,
    });
  };

  const percentageCompleted = Math.round(
    (objStatistics.totalViewed * 100) / objStatistics.totalPages
  );

  return (
    <Transition
      in={props.isDashboardVisible}
      mountOnEnter
      unmountOnExit
      onEnter={handleEnterAnimation}
      onExit={handleExitAnimation}
      timeout={ANIMATION_DURATION_MS}
    >
      {(state) => (
        <div
          className={styles.dashboardContainer}
          style={{ ...dashboardStyle }}
        >
          <span className={styles.titleWelcome}>
            {structureData.greetings} {props.studentName}
          </span>

          <div className={styles.flexContainer}>
            <div className={styles.cardChart}>
              <h3>Completamento corso</h3>
              <Doughnut
                percentage={percentageCompleted}
                innerLabel={structureData.innerDoughnut}
                isPercent={true}
              />
            </div>
            <div className={styles.cardChart}>
              <h3>Punteggio</h3>
              <Doughnut
                percentage={
                  (objStatistics.scoreDone * 100) / objStatistics.maxScore
                }
                valueShowed={objStatistics.scoreDone}
                innerLabel={
                  <img src={TropySvg} alt="" style={{ width: "50px" }} />
                }
                isPercent={false}
              />
            </div>
            <div
              className={[styles.flexContainer, styles.column].join(" ")}
              style={{ flex: "1 0" }}
            >
              {structureData?.modules?.map((elMod, keyM) => {
                return elMod?.lessons?.map((elLes, keyL) => {
                  return (
                    <div
                      key={"cardChart_" + keyM + "_" + keyL}
                      className={styles.cardChart}
                      style={{ textAlign: "left" }}
                    >
                      <h4>{elMod.title}</h4>
                      <h3>{elLes.title}</h3>
                      <span>
                        {objStatistics?.modules?.[keyM]?.[keyL]?.totalViewed |
                          0}
                        /
                        {objStatistics?.modules?.[keyM]?.[keyL]?.totalPages | 0}{" "}
                        pagine{" "}
                      </span>
                      <div className={styles.progressContainer}>
                        <div
                          style={{
                            width: `${objStatistics?.modules?.[keyM]?.[keyL]?.totalPercentage}%`,
                          }}
                          className={styles.progress}
                        />
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
          <div className={styles.flexContainer}>
            <div className={styles.cardChart}>
              <h3>Esercizi svolti</h3>
              {objStatistics.exercisesDone}/{objStatistics.totalExercises}
              <div className={styles.progressContainer}>
                <div
                  className={styles.progress}
                  style={{
                    width:
                      Math.round(
                        (objStatistics.exercisesDone * 100) /
                          objStatistics.totalExercises
                      ) + "%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};

export default Dashboard;
