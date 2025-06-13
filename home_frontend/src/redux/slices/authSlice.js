import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogined: false,
    user: {},
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const newState = { ...state, isLogined: true, user: action.payload };
            return newState;
        },
        logOutSuccess: () => {
            return initialState;
        },
    },
});

export const { loginSuccess,logOutSuccess } = authSlice.actions;

export default authSlice.reducer;
