import React from "react";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "./reset.css";
import ScormProvider from "./utils/react-scorm-provider";
import Learner from "./components/Learner/Learner";
import "./App.scss";
import log from "loglevel";
import { store } from "./store/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import SwapLangSelectorLearner from "./components/SwapLangSelectorLearner/SwapLangSelectorLearner.jsx";

if (!import.meta.env.PROD) {
  log.setLevel("INFO");
} else {
  log.setLevel("ERROR");
}

function App() {
  return (
    <ScormProvider version="1.2" debug={import.meta.env.DEV}>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <SwapLangSelectorLearner />
        </DndProvider>
      </Provider>
    </ScormProvider>
  );
}

export default App;
