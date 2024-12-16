import { createSlice } from '@reduxjs/toolkit'

/**
 * Contiene i dati della struttura del corso (es. store/lang/it.json)
 *
 */
export const structureSlice = createSlice({
    name: 'structure',
    initialState: { data: null },
    reducers: {
        setStructure: (state, action) => {
            state.data = {...action.payload};
        }
    },
})

// Action creators are generated for each case reducer function
export const structureActions = structureSlice.actions

export default structureSlice.reducer
