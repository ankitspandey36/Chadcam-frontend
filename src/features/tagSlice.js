import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    tags: []
}

const tagSlice = createSlice({
    name: 'tags',
    initialState,
    reducers: {
        setTags: (state, action) => {
            state.tags = [...new Set([...state.tags, ...action.payload])];
        },
        removeTags: (state, action) => {
            state.tags = state.tags.filter((_, idx) => idx != action.payload)
        },
        clearTags: (state, action) => {
            state.tags = []
        }
    }
})

export const { setTags, removeTags, clearTags } = tagSlice.actions
export default tagSlice.reducer
