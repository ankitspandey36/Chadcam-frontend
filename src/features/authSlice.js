import { createSlice } from "@reduxjs/toolkit";

const rawUserData = localStorage.getItem("userdata");
const savedUser = rawUserData ? JSON.parse(rawUserData) : null;

const initialState = {
    isLoggedIn: !!savedUser,
    user: savedUser || null
}

const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true
            state.user = action.payload
        },
        logout: (state, action) => {
            localStorage.removeItem("userdata");

            state.isLoggedIn = false
            state.user = null
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer