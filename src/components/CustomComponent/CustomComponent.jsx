import React from "react";

import AreeCliccabili from "../AreeCliccabili/AreeCliccabili";
import PopupOpenChildren from "../PopupOpenChildren/PopupOpenChildren";

const CustomComponent = (props) => {
  const components = {
    approfondimenti: AreeCliccabili,
    popupOpenChildren: PopupOpenChildren
  };

  const TagName = components[props.tagComponent];
  return <TagName {...props} />;
};
export default CustomComponent;
