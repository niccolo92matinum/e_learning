import { configureStore } from '@reduxjs/toolkit'
import courseReducer from './slices/courseSlice'
import structureReducer from './slices/structureSlice';
import lmsReducer from './slices/lmsSlice';
import bookmarkReducer from './slices/bookmarkSlice';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        structure: structureReducer,
        lms: lmsReducer,
        bookmark: bookmarkReducer
    },
})