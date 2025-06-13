import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rooms: [],
};

export const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        getListRoom: (state, action) => {
            const newState = { ...state, rooms: action.payload };
            return newState;
        },
    },
});

export const { getListRoom } = roomSlice.actions;

export default roomSlice.reducer;
