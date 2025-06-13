import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open: false,
};

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        toggleSidenav: (state) => {
            state.open = !state.open;
        },
    },
});

export const { toggleSidenav } = adminSlice.actions;

export default adminSlice.reducer;
