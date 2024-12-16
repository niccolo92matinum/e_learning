import React, { useState } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import "./wrapperContext.scss";

const WrapperContext = (props) => {
  const { children, isShowControlsVisible } = props;
  const [isVisibleVideoControl, setIsVisibleVideoControl] = useState(false);

  return (
    <>
      <ContextMenuTrigger id="contextMenu">{children}</ContextMenuTrigger>

        {isShowControlsVisible && <ContextMenu id="contextMenu">
          <MenuItem
            onClick={() => {
              if (isVisibleVideoControl) {
                props.player.controls(false);
                props.player.controlBar.hide();
              } else {
                props.player.controls(true);
                props.player.controlBar.show();
              }
              setIsVisibleVideoControl(!isVisibleVideoControl);
            }}
          >
            {isVisibleVideoControl
              ? "Nascondi controlli video"
              : "Mostra controlli video"}
          </MenuItem>
      </ContextMenu>       }
    </>
  );
};

export default WrapperContext;
