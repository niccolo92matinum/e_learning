import React, {useCallback, useEffect, useRef, useState} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Footer from "../Footer/Footer.jsx";
import WrapperContext from "./wrapperContext.jsx";
import { useKeyPress } from "../../utils/useKeyPress.js";
import { useKeyPressCallback } from "../../utils/useKeyPressCallback.js";
import BigPlay from "./theme/BigPlay.jsx";
import styles from "./VideoJS.module.scss";

const defaultPlayerOptions = {
  autoplay: true,
  controls: true,
  muted: false,
  preload: "auto",
  aspectRatio: "16:9",
  fluid: true,
  mobileView: false,
};
export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const currentTimeRef = useRef(0);
  const [videoPaused, setVideoPaused] = useState(true);
  const { options, onReady, muted } = props;
  const isShowControlsVisible = useKeyPress("q");

  useEffect(() => {
    const interval = setInterval(() => {
      currentTimeRef.current = playerRef.current.currentTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
      playerRef.current?.muted(muted);
  },[playerRef.current,muted])

  const onSeekHandler = () => {
    props.onVideoEnded(playerRef.current.ended(), props.idLesson, props.idPage);

    if (
      props.preventSeek &&
      currentTimeRef.current < playerRef.current.currentTime()
    ) {
      playerRef.current.currentTime(currentTimeRef.current);
    }
  };

  const onPlayEventHandler = () => {
    setVideoPaused(playerRef.current.paused());
  };

  const onPauseEventHandler = () => {
    setVideoPaused(playerRef.current.paused());
  };

  const onCanplaythroughEventHandler = () => {
    /* onVideoStarted serve a far scattare nel parent lo state di setIsVideoEnded a false quando riparte un nuovo video
     *  questo è utile, ad esempio, in caso del tasto continua per sapere se il video è terminato e può apparire il tasto
     */
    props.onVideoStarted();
  };

  const onEndedEventHandler = useCallback(() => {
      props.onVideoEnded(playerRef.current.ended(), props.idLesson, props.idPage);
  }, [props.idLesson, props.idPage]);

  useKeyPressCallback(32, () => {
    if (!playerRef.current) return;
    if (playerRef.current.paused()) playerRef.current.play();
    else {
      playerRef.current.pause();
    }
  });

  const removeAllTracks = () => {
    let tracks = playerRef.current.remoteTextTracks();
    let numTracks = tracks.length;
    for (var i = numTracks - 1; i >= 0; i--) {
      playerRef.current.removeRemoteTextTrack(tracks[i]);
    }
  };

  const addRemoteTracks = (_vttLangArray) => {
    _vttLangArray.forEach((el) => {
        props.videoVtt && playerRef.current.addRemoteTextTrack(
        {
          kind: "captions",
          language: el,
          label: el,
          src: props.videoVtt[el],
        },
        true
      );
    });
  };

  const onPlaybackRatesChange = () => {
    playerRef.current.playbackRate(1.0);
  };

  const showVideoVtt = (lang)=>{
      var tracks = playerRef.current?.textTracks();
      if (tracks && tracks.length) {
          for (var i = 0; tracks && i < tracks.length; i++) {
              const track = tracks[i];
              if (track.kind === "captions" && track.language === lang) {
                  track.mode = "showing";
              } else {
                  track.mode = "disabled";
              }
          }
      }
  }

  React.useEffect(() => {
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

      const player = (playerRef.current = videojs(
        videoElement,
        extendedOptions,
        () => {
          videojs.log("player is ready");
          onReady && onReady(player);
        }
      ));
      player.src(`./assets/video/${props.currentLang}/${props.videoSrc}.mp4`);
        removeAllTracks();
        addRemoteTracks(props.vttLangArray);

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;
        player.src(`./assets/video/${props.currentLang}/${props.videoSrc}.mp4`);
      removeAllTracks();
      addRemoteTracks(props.vttLangArray);
    }
  }, [options, videoRef, props.videoSrc, props.videoVtt, props.currentLang, ]);

  useEffect(()=>{
      showVideoVtt(props.currentVttLang);
  },[props.currentVttLang])

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;
    addRemoteTracks(props.vttLangArray);
    if (!props.controlsVideoJsEnabled) {
      // workaround: anche con la property controls a false la barra rimane visibile (playerOptions.controls)
      playerRef.current.controlBar.hide();
    }

    playerRef.current.on("play", onPlayEventHandler);
    playerRef.current.on("pause", onPauseEventHandler);
    playerRef.current.on("canplaythrough", onCanplaythroughEventHandler);
    playerRef.current.on("seeking", onSeekHandler);
    playerRef.current.on("timeupdate", onPlaybackRatesChange )

    return () => {
      if (player && !player.isDisposed()) {
        removeAllTracks();
        playerRef.current.off("play", onPlayEventHandler);
        playerRef.current.off("pause", onPauseEventHandler);
        playerRef.current.off("canplaythrough", onCanplaythroughEventHandler);
        playerRef.current.off("seeking", onSeekHandler);
        playerRef.current.off("timeupdate", onPlaybackRatesChange);
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  useEffect(() => {
    if (!playerRef.current) return;

    playerRef.current.on("ended", onEndedEventHandler);
    return () => {
      playerRef.current?.off("ended", onEndedEventHandler);
    };
  }, [onEndedEventHandler]);

  return (
      <WrapperContext
          isShowControlsVisible={isShowControlsVisible}
          player={playerRef.current}
      >
          <div data-vjs-player id="playerJs" className={styles.VideoJS}>
              <div ref={videoRef} className={styles.videoContent}/>
          </div>
          {playerRef.current && videoPaused && !playerRef.current.ended() && (
              <BigPlay
                  onPlay={() => {
                      playerRef.current.play();
                  }}
              />
          )}
          <Footer player={playerRef.current} restricted={props.preventSeek}/>
      </WrapperContext>
  );
};

export default VideoJS;
