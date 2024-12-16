import React, { useRef } from "react";
import gsap from "gsap";
import Transition from "react-transition-group/cjs/Transition";

const TransitionFadeInLeft = (props) => {
  const ANIMATION_DURATION_MS = 500;
  const contentRef = useRef(null);

  const handleEnterAnimation = (node, isAppearing) => {
    if (!contentRef.current) return;
    //gsap.fromTo(node, {opacity: 0, top: "100px"}, {opacity: 1, top: "10px", duration: 2});
    let _tween = gsap.timeline({ paused: true });

    // Animate element
    _tween.fromTo(
      contentRef.current,
      { opacity: 0, translateX: "100%" },
      {
        duration: ANIMATION_DURATION_MS / 1000,
        opacity: 1,
        translateX: "0",
      }
    );
    _tween.play();
  };

  const handleExitAnimation = (node) => {
    if (!contentRef.current) return;
    /*gsap.fromTo(node,  {opacity: 1, top: "10px"},{opacity: 0, top: "100px", duration: 2});*/
  };

  return (
    <Transition
      in={props.visible}
      nodeRef={contentRef}
      appear={true}
      mountOnEnter
      unmountOnExit
      timeout={ANIMATION_DURATION_MS}
      onEnter={handleEnterAnimation}
      onExit={handleExitAnimation}
    >
      <div ref={contentRef}>{props.children}</div>
    </Transition>
  );
};

export default TransitionFadeInLeft;
