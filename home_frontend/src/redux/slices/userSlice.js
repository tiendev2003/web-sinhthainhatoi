import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: [],
    isChangeInfo: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        getUserList: (state, action) => {
            const newState = { ...state, user: action.payload };

            return newState;
        },
        removeUser: (state, action) => {
            const newState = {
                ...state,
                user: [...state.user].filter((item) => {
                    return item._id !== action.payload;
                }),
            };
            return newState;
        },
        changeInfo: (state, action) => {
            const newState = {
                ...state,
                isChangeInfo: !state.isChangeInfo,
            };
            return newState;
        },
    },
});

export const { getUserList, removeUser, changeInfo } = userSlice.actions;

export default userSlice.reducer;
