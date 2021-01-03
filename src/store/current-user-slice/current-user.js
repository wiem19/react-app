import { createSlice } from "@reduxjs/toolkit";



const slice = createSlice({
    name: "currentUser",
    initialState: {
        id: "",
        connected: false,
        networkConnection: true


    },
    reducers: {
        userSet: (currentUser, { payload }) => {
            currentUser.id = payload.id;
        },
        userConnected: (currentUser, _) => {
            currentUser.connected = true;
        },
        userDisconnected: (currentUser, _) => {
            currentUser.connected = false;
        },
        networkConnected: (currentUser, _) => {
            currentUser.networkConnected = true;
        },
        networkDisconnected: (currentUser, _) => {
            currentUser.networkConnected = false;
        },

    }
});

export const { userSet, userConnected, userDisconnected, networkDisconnected, networkConnected } = slice.actions;

export default slice.reducer;