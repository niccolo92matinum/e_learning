import React, { useEffect, useRef, useState } from "react";
import FixedAspectRatioContainer from "../Hoc/FixedAspectRatioContainer/FixedAspectRatioContainer";
import Popup from "../Popup/Popup";
import DebugDnD from "./DebugDnD";
import ApproPDF from "../Popup/ApproPDF";
import ApproVideo from "../Popup/ApproVideo";
import TransitionFade from "../TransitionFade/TransitionFade";

import styles from "./AreeCliccabili.module.scss";
import { useSelector } from "react-redux";

import iconPdf from '/assets/images/PDF_file_icon.png';

import log from "loglevel";
import Sound from "react-sound";
import useAudio from "../../utils/useAudio.js";
const AreeCliccabili = (props) => {
  let [popupVisible, setPopupVisible] = useState(-1);
  let [popupType, setPopupType] = useState(null);
  let [approViewed, setApproViewed] = useState([]);
  let [customProps, setCustomProps] = useState({});

  const areeCliccabiliRef = useRef(null);

  const courseData = useSelector((state) => state.course.data);

  const openPopup = (_approItem, _index) => {
    setPopupVisible(_index);
    setPopupType(_approItem.popupType);
    setCustomProps(_approItem.props);
  };

  const openLink = (link, indexAppro) => {
    trackingAppro(indexAppro);
    window.open(link, "_blank");
  };

  /** All'apertura degli approfondimenti li imposto tutti a viewed false **/
  useEffect(() => {
    setApproViewed(props.propsComponent.detailed.map((detailed) => false));
  }, [props.propsComponent?.detailed]);


    const [audioPlayStatus, audioSrc, stopAudioHandler, volume] = useAudio(
        props.propsComponent.detailed[popupVisible]?.audio,
        popupVisible >= 0,
        courseData?.lang?.currentLang,
        courseData?.videoMuted
    );

  const trackingAppro = (popupIndexVisible) => {
    const tmpApproViewedState = [...approViewed];
    tmpApproViewedState[popupIndexVisible] = true;
    setApproViewed(tmpApproViewedState);

    const allViewed =
      tmpApproViewedState.length &&
      tmpApproViewedState.findIndex(
        (appro, index) =>
          !props.propsComponent.detailed[index].optional && !appro
      ) < 0;
    if (allViewed) {
      props.onTrackViewedComponent();
    }
  };

  const onClosePopup = () => {
    trackingAppro(popupVisible);
    setPopupVisible(-1);
  };

  const getApproElement = () => {
    switch (popupType) {
      case "pdf":
        return (
          <ApproPDF
            title={customProps.title}
            pdfLink={customProps.pdfLink}
            onClosePopup={onClosePopup}
          />
        );
      case "video":
        return <ApproVideo {...customProps} onClosePopup={onClosePopup} />;
      default:
        log.info("PopupType non è indicato. Viene aperto popup di default.");
        return (
          <Popup
            title={customProps.title}
            text={customProps.nodeHtml}
            onClosePopup={onClosePopup}
          />
        );
    }
  };

  const renderSingleArea = (el, i, isCoordsBlock) => {
    return (
      <div
        key={"detailed_" + i}
        className={`${styles.ClickArea} ${approViewed[i] ? styles.Viewed : ''} ${el.popupType === "pdfSintesi" ? styles.pdfSintesiArea : ''}`}
        style={props.positionType !== "flex" ? { ...el.coords } : null}
        onClick={() => {
          el.popupType === "link" || el.popupType === "pdfSintesi"
            ? openLink(el.props.link, i)
            : openPopup(el, i);
        }}
      >
          {(el.popupType === "pdfSintesi") && <div className={styles.flexColumn}><img src={iconPdf} alt=""/><p className={styles.description}>{el.props.description}</p><p className={styles.title}>{el.props.title}</p></div> }
        {isCoordsBlock && <div></div>} {/*coordsBlock*/}
          { props.positionType === "flex" && (el.popupType !== "pdfSintesi") && <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px'}}><h2>{el.props?.title}</h2></div>}
      </div>
    );
  };

  const areeCliccabiliContent = (positionFlex) => {
    /** Calcolo responsive per evitare errori di mappatura in presenza delle bande nere */
    return (
      <div
          className={positionFlex ? styles.PositionFlex : ''}
        style={{ height: "100%", width: "100%" }}
        ref={areeCliccabiliRef}
        onClickCapture={(e) => {
          courseData.editMode && e.stopPropagation();
        }}
      >
        {props.propsComponent.detailed.map((el, i) => {
          if (courseData.editMode) {
            return (
              <DebugDnD
                coords={el.coords}
                key={"debugDnD_" + i}
                areeCliccabiliRef={areeCliccabiliRef}
              >
                {renderSingleArea(el, i, true)}
              </DebugDnD>
            );
          } else return renderSingleArea(el, i);
        })}
        <TransitionFade visible={popupVisible >= 0}>
          {getApproElement()}
        </TransitionFade>
          {popupVisible >= 0 && audioSrc && <Sound playStatus={audioPlayStatus} url={audioSrc} onFinishedPlaying={stopAudioHandler} volume={volume}/>}
      </div>
    );
  };

  return props.positionType === "flex" ? (
    <div
      style={{height: "100%", width: "100%", backgroundSize: 'cover', backgroundImage: props.propsComponent.backgroundImage ? `url(assets/images/${props.propsComponent.backgroundImage})` : 'none'}}
    >
      {areeCliccabiliContent(true)}
    </div>
  ) : (
    <FixedAspectRatioContainer>
      {areeCliccabiliContent()}
    </FixedAspectRatioContainer>
  );
};

export default AreeCliccabili;
