import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roomId: null
}

const roomIdSlice = createSlice({
    name: 'roomId',
    initialState,
    reducers: {
        setroomId: (state, action) => {
            state.roomId = action.payload
        }
    }
})

export const { setroomId } = roomIdSlice.actions
export default roomIdSlice.reducer