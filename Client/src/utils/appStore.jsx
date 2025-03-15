import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice";
import studentReducer from "./studentSlice";
import teacherReducer from "./teacherSlice";


export const store = configureStore({
    reducer:{
    admin: adminReducer,
    student: studentReducer,
    teacher: teacherReducer,
    }
});

export default store;
