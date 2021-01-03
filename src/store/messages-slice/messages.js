import {
    createSlice
} from "@reduxjs/toolkit";



const slice = createSlice({
    name: "massages",
    initialState: {
        unreadMessages: 0,

        messagesList: [


        ]
    },

    reducers: {
        meessageAdded: (messages, { payload: { id, date, message, isCurrentUser } }) => {
            messages.messagesList.push({ id, date, message });
            if (!isCurrentUser) messages.unreadMessages++;
        },
        messagesRead: (messages, { payload }) => {
            messages.unreadMessages = 0;
        }

    },



});



export const {
    meessageAdded,
    messagesRead

} = slice.actions;

export default slice.reducer;