import React, { useEffect, useState } from "react";
import Radium from "radium";
import ProgressBar from "./ProgressBar/ProgressBar";
import { noop } from "../../utils";
import styles from "./Footer.module.scss";
const Footer = (props) => {
  const [playedPerc, setPlayedPerc] = useState(0);

  useEffect(() => {
    const onTimeUpdateHandler = () => {
      setPlayedPerc(
        props.player?.currentTime() / props.player?.duration() || 0,
      );
    };

    props.player?.on("timeupdate", onTimeUpdateHandler);
    return () => {
      props.player?.off("timeupdate", onTimeUpdateHandler);
    };
  }, [props.player]);

  return (
    <div className={[styles.Footer].join(" ")}>
      <ProgressBar
        played={playedPerc}
        restricted={props.restricted}
        videoDuration={props.player?.duration()}
        pauseVideo={() => {
          props.player ? props.player?.pause() : noop();
        }}
        playVideo={() => {
          props.player ? props.player?.play() : noop();
        }}
        onSeek={(value, getPlay) => {
          if (!props.restricted) {
            if (getPlay) {
              props.player.play();
            }
            props.player.currentTime(props.player.duration() * value);
          }
        }}
      />
    </div>
  );
};

export default Radium(Footer);
