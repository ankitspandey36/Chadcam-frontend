import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roomId: null,
    hmsRoomId: null
}

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRoomId: (state, action) => {
            state.roomId = action.payload
        },
        unsetRoomId: (state, action) => {
            state.roomId = null;
        },
        setHMSRoomId: (state, action) => {
            state.hmsRoomId = action.payload
        },
        unsetHMSRoomId: (state, action) => {
            state.hmsRoomId = null;
        },

    }
})

export const { setRoomId, unsetRoomId, setHMSRoomId, unsetHMSRoomId } = roomSlice.actions
export default roomSlice.reducer;