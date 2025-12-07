import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    peer: []
}

const peerSlice = createSlice({
    name:"peer",
    initialState,
    reducers: {
        setPeer: (state, action) => {
            state.peer = [...action.payload]
        }
    }
})

export const { setPeer } = peerSlice.actions
export default peerSlice.reducer;