import React from "react";

export default function useFullscreenStatus(elRef) {
  const [isFullscreen, setIsFullscreen] = React.useState(
    document[getBrowserFullscreenElementProp()] != null
  );

  const setFullscreen = () => {
    if (elRef.current == null) return;

    const customRequestFullScreen =
      elRef?.current.requestFullscreen ||
      elRef?.current.webkitRequestFullscreen ||
      elRef?.current.mozRequestFullScreen ||
      elRef?.current.msRequestFullscreen;

    customRequestFullScreen
      ?.call(elRef?.current)
      ?.then(() => {
        setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);
      })
      .catch(() => {
        setIsFullscreen(false);
      });
  };

  React.useLayoutEffect(() => {
    document.onfullscreenchange = () =>
      setIsFullscreen(document[getBrowserFullscreenElementProp()] != null);

    /** FIX bug su safari */
    document.addEventListener("webkitfullscreenchange", () =>
      setTimeout(
        () =>
          setIsFullscreen(document[getBrowserFullscreenElementProp()] != null),
        0
      )
    );

    return () => {
      document.onfullscreenchange = undefined;
    };
  });

  return [isFullscreen, setFullscreen];
}

function getBrowserFullscreenElementProp() {
  if (typeof document.fullscreenElement !== "undefined") {
    return "fullscreenElement";
  } else if (typeof document.mozFullScreenElement !== "undefined") {
    return "mozFullScreenElement";
  } else if (typeof document.msFullscreenElement !== "undefined") {
    return "msFullscreenElement";
  } else if (typeof document.webkitFullscreenElement !== "undefined") {
    return "webkitFullscreenElement";
  } else {
    throw new Error("fullscreenElement is not supported by this browser");
  }
}
