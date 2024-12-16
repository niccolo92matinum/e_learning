import React, { useEffect, useState } from "react";
import { Slider } from "react-player-controls";
import styles from "./ProgressBar.module.scss";

const ClientColor = '#E41F46';
const ClientSecondaryColor = '#FFF';

const ProgressBar = (props) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [lastIntent, setLastIntent] = useState(0);

  useEffect(() => {
    setCurrentValue(props.played);
  }, [props.played]);

  const SliderBar = ({ direction, value, style }) => {
    return (
      <div
        className={styles.sliderBar}
        style={{ ...style, width: `${value * 100}%` }}
      />
    );
  };

  const SliderHandle = ({ direction, value, style }) => {
    return (
      <div
        className={styles.SliderHandle}
        style={{ ...style, left: `${value * 100}%` }}
      />
    );
  };

  return (
    <Slider
      className={[styles.sliderContainer].join(" ")}
      isEnabled={true}
      style={{ background: ClientColor, zIndex: "999" }}
      direction={props.direction}
      onChange={(newValue) => {
        if (!props.restricted) {
          setCurrentValue(newValue);
          props.onSeek(newValue, true);
        }
      }}
      // onChangeStart={startValue => {setLastValueStart(startValue)}}
      // onChangeEnd={endValue => { if(!endValue)return; setLastValueEnd(endValue)}}
      //onIntent={(intent) => setLastIntent(intent)}
      // onIntentStart={intent => setLastValueStart(intent)}
      /*onIntentEnd={() => {
        setLastIntent(currentValue);
      }}*/
      {...props}
    >
      <SliderBar
        direction={props.direction}
        value={1}
        style={{ background: ClientSecondaryColor, zIndex: "1" }}
        className={`${styles.sliderBar} ${styles.sliderBarBg}`}
      />
      <SliderBar
        direction={props.direction}
        value={currentValue}
        className={styles.sliderBar}
      />
      <SliderBar
        direction={props.direction}
        value={lastIntent}
        className={styles.sliderBar}
      />
      {/*<SliderHandle
        direction={props.direction}
        value={currentValue}
        className={styles.SliderHandle}
      />*/}
    </Slider>
  );
};

export default ProgressBar;
