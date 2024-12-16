import React, { useEffect, useRef } from "react";
import DisableDevtool from "disable-devtool";

export const useDisableDevtool = (disableDevtool) => {
  useEffect(() => {
    if (!disableDevtool) return;
    DisableDevtool({
      ondevtoolopen: (type) => {
        const info =
          "You cannot use DevTools during the course. Close DevTools to continue."; /*'devtool opened!; type =' + type;*/
        alert(info); // If you are worried about blocking the page, use console.warn(info); and open the console to view
      },
      url: "#",
    });
  }, [disableDevtool]);
};
