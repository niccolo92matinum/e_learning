import React, { Suspense } from "react";
import Spinner from "../Spinner/Spinner";
import { useSelector } from "react-redux";
import VideoJS from "../VideoJSPlayer/VideoJS.jsx";
const ChildrenPage = React.lazy(() => import("../ChildrenPage/ChildrenPage")); //TODO: su mobile il componente viene aggiunto con una sorta di transition. Rimuoviamo il lazy o ci sono altre soluzioni?

/**
 * Gestisce l'interazione video e i suoi children
 * @param {*} props
 * @returns
 */
const ContentPage = (props) => {
  /**
   * L'idea è che si possa rendere il video interattivo in n punti.
   * Timing diventa l'array dei punti di interruzione e courseData.indexComponent l'indice
   * del component e del timing in cui mostrare il component stesso.
   * !!! Timing deve avere stessa numerosità di components
   */
  const courseData = useSelector((state) => state.course.data);
  return (
    <>
      <Suspense fallback={<Spinner />}>
        {props.currentSrc && (
          <VideoJS
              muted={courseData?.videoMuted}
              currentLang={courseData?.lang?.currentLang}
            onReady={props.onPlayerReady}
            langArray={courseData?.languages?.map((el) => {
              return el.small_title;
            })}
            vttLangArray={courseData?.vttLanguages?.map((el) => {
                return el.small_title;
            })}
            loadingNewVideo={props.loadingNewVideo}
            onVideoEnded={(ended, _idLesson, _idPage)=>props.onVideoEnded(ended, _idLesson, _idPage)}
            onVideoStarted={() => {
              props.onVideoStarted();
            }}
            idLesson={courseData.currentPage?.idLesson}
            idPage={courseData.currentPage?.idPage}
            controlsVideoJsEnabled={courseData.controlsVideoJs}
            videoSrc={props.currentSrc}
            videoVtt={props.currentVtt}
            preventSeek={courseData?.restricted && !props.isViewedPage}
            currentVttLang={props.currentVttLang}
          />
        )}
      </Suspense>
      <Suspense fallback={<Spinner />}>
        {props.openedChild && (
          <ChildrenPage
            component={props.openedChild.component}
            onTrackChildComponent={props.onTrackChildComponent}
            childrenCount={props.childLength || 0}
            pageId={props.pageId}
            goNextPage={props.onNextPage}
            currentLang={props.currentLang}
            muted={courseData.videoMuted}
          />
        )}
      </Suspense>
    </>
  );
};

export default ContentPage;
