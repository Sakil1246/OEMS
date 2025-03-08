import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import adminReducer from "./adminSlice";
import studentReducer from "./studentSlice";
import teacherReducer from "./teacherSlice";

const persistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    admin: adminReducer,
    student: studentReducer,
    teacher: teacherReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
