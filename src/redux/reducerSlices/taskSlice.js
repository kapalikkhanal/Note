//not used in our project, refer this for crud operation
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    userDetails: []
};

const taskSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        updateLoginForm: (state, actions) => {
            // debugger;
            state.userDetails.push(actions.payload)
        },
        changeUserFormValues: (state, actions) => {
            state.userDetails[actions.payload.id] = actions.payload
        },
        deleteUser: (state, actions) => {
            state.userDetails.splice(actions.payload.id, 1)
        },
    },
});

export const { updateLoginForm, changeUserFormValues, deleteUser } = taskSlice.actions;
export default taskSlice.reducer;