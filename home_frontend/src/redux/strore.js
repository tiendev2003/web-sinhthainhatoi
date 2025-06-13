import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/AdminPageSlice";
import userReducer from "./slices/userSlice";
import roomReducer from "./slices/roomSlice";
import cuisineReducer from "./slices/CuisineSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        user: userReducer,
        room: roomReducer,
        cuisine: cuisineReducer,
    },
});
