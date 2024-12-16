import React from 'react';
import styles from "./AudioTranscription.module.scss";
import Transition from "react-transition-group/cjs/Transition";

const duration = 1000
const ANIMATION_DURATION_MS = 10;

const audioTranscriptionStyle = {
    transition: `${duration}ms`
}

const audioTranscriptionTransitionStyles = {
    entering: { transform: "translate(-100%)" },
    entered: { transform: "translate(0)" },
    exiting: { transform: "translate(0)" },
    exited: { transform: "translate(-100%)" }
}

const AudioTranscription = React.forwardRef((props, ref) => (
    <Transition
        in={props.isOpen}
        timeout={{enter: ANIMATION_DURATION_MS, exit: ANIMATION_DURATION_MS}}
    >
        {
            state => (
                <div ref={ref} className={styles.AudioTranscription} style={{...audioTranscriptionStyle, ...audioTranscriptionTransitionStyles[state]}} tabIndex="0">
                    <p dangerouslySetInnerHTML={{__html: props.audioTranscription}}/>
                </div>
            )
        }

    </Transition>
));

export default AudioTranscription;