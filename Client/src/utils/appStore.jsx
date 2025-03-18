import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import adminReducer from "./adminSlice";
import studentReducer from "./studentSlice";
import teacherReducer from "./teacherSlice";
import { combineReducers } from "redux";

// Combine reducers
const rootReducer = combineReducers({
  admin: adminReducer,
  student: studentReducer,
  teacher: teacherReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
 