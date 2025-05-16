import { createSlice } from "@reduxjs/toolkit";


const teacherNotificationSlice = createSlice({
    name: "teacherNotification",
    initialState:{ 
        notification:null,
        trigger:0
    },
    reducers: {
        addTeacherNotification: (state, action) => {
           state.notification=  action.payload;
        },
        removeTeacherNotification: () => {
            state.notification = null;
            state.trigger = 0;
        },
        updateFlag: (state, action) => {
            state.notification.flag = action.payload.flag;
        },
        pressTrigger: (state, action) => {
            state.trigger +=1;
        }
    },
})

export const {addTeacherNotification,removeTeacherNotification,pressTrigger}=teacherNotificationSlice.actions;
export default teacherNotificationSlice.reducer;