import { createSlice } from "@reduxjs/toolkit";


const teacherNotificationSlice = createSlice({
    name: "teacherNotification",
    initialState: null,
    reducers: {
        addTeacherNotification: (state, action) => {
            return action.payload;
        },
        removeTeacherNotification: () => null,
        updateFlag: (state, action) => {
            state.flag = action.payload.flag;
        }
    },
})

export const {addTeacherNotification,removeTeacherNotification}=teacherNotificationSlice.actions;
export default teacherNotificationSlice.reducer;