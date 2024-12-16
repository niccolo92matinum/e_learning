import { createSlice } from "@reduxjs/toolkit";
import log from "loglevel";
import { bookmarkActions } from "./bookmarkSlice";

/**
 * Contiene i dati di initial-state-course.json
 *
 */
export const courseSlice = createSlice({
  name: "course",
  initialState: { data: null },
  reducers: {
    initConfig: (state, action) => {
      log.enableAll();
      state.data = { ...action.payload };
      state.data.isEndedCourse = false;
      state.data.audioTranscriptionVisible = false;
    },
    setLang: (state, action) => {
      state.data.lang.currentLang = action.payload;
    },
    setVttLang: (state, action) => {
      state.data.lang.vttLang = action.payload;
    },
    openLandingPage: (state, action) => {
      state.data.landingPageVisible = true;
    },
    openModule: (state, action) => {
      state.data.currentPage.idModule = action.payload;
    },
    setOpenedPage: (state, action) => {
      state.data.currentPage.idModule = action.payload.idModule;
      state.data.currentPage.idLesson = action.payload.idLesson;
      state.data.currentPage.idPage = action.payload.idPage;
      state.data.landingPageVisible = false;
    },
    setCurrentPage: (state, action) => {
      state.data.currentPage = action.payload;
    },
    setCurrentComponentIdx: (state, action) => {
      state.data.indexComponent = action.payload;
    },
    setCurrentExerciseIdx: (state, action) => {
      state.data.indexExercise = action.payload;
    },
    toggleAudioTranscription: (state) => {
      state.data.audioTranscriptionVisible =
        !state.data.audioTranscriptionVisible;
    },
      toggleVideoMuted: (state) => {
        state.data.videoMuted = !state.data.videoMuted
    }
  },
});

/* Action Creator Thunks */
export const openPage = (
  idModule,
  idLesson,
  idPage,
  pageIndex,
  isRestricted
) => {
  return async (dispatch) => {
    dispatch(courseActions.setOpenedPage({ idModule, idLesson, idPage }));
    // traccio il bookmark
    const bookmark = `${idModule}:${idLesson}:${idPage}`;
    dispatch(bookmarkActions.updateBookmark({ bookmark, idLesson, idPage }));

    // se la navigazione è libera, traccio viewed all'apertura della pagina
    if (!isRestricted) {
      dispatch(bookmarkActions.setPageViewed({ idLesson, idPage, pageIndex }));
    }
  };
};

// Action creators are generated for each case reducer function
export const courseActions = courseSlice.actions;

export default courseSlice.reducer;
