import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cuisines: [],
    food: [],
    drink: [],
};

export const cuisineSlice = createSlice({
    name: "cuisine",
    initialState,
    reducers: {
        getListCuisine: (state, action) => {
            const newState = { ...state, cuisines: action.payload };
            return newState;
        },
        getListFood: (state, action) => {
            const newState = { ...state, food: action.payload };
            return newState;
        },
        getListDrinks: (state, action) => {
            const newState = { ...state, drink: action.payload };
            return newState;
        }
    },
});

export const { getListCuisine, getListFood,getListDrinks } = cuisineSlice.actions;

export default cuisineSlice.reducer;
