import { createSlice } from "@reduxjs/toolkit";

const studentSlice=createSlice(
   { name:"student",
    initialState: null, 
    reducers:{
        addStudent:(state,action)=>{
            return action.payload;
        },
        removeStudent:()=>null,
    }}
    
)

export const {addStudent,removeStudent}=studentSlice.actions;
export default studentSlice.reducer;