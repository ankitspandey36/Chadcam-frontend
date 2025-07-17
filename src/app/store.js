import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js"
import tagReducer from "../features/tagSlice.js"
import roomReducer from "../features/roomSlice.js"


export const store = configureStore({
    reducer: {
        auth: authReducer,
        tags: tagReducer,
        room:roomReducer
    }
})