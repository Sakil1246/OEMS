import { createSlice } from "@reduxjs/toolkit";

const teacherSlice=createSlice({
    name:"teacher",
    initialState: null,
    reducers:{
        addTeacher:(state,action)=>{
            return action.payload;
        },
        removeTeacher:()=>null,
    }
})
export const {addTeacher,removeTeacher}=teacherSlice.actions;
export default teacherSlice.reducer;