import { createSlice } from '@reduxjs/toolkit';

/**
 * Contiene i dati di initial-state-lms.json
 *
 */
export const lmsSlice = createSlice({
    name: 'lms',
    initialState: { data: null, restoreModal: null },
    reducers: {
        initConfig: (state, action) => {
            state.data = {...action.payload.data};
        }
    },
})

// Action creators are generated for each case reducer function
export const lmsActions = lmsSlice.actions

export default lmsSlice.reducer
