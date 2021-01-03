import {
    createSlice
} from "@reduxjs/toolkit";



const slice = createSlice({
    name: "connectedUsers",
    initialState: {
        confirenceUsers: [


        ]
    },

    reducers: {
        userAdded: (users, action) => {
            users.confirenceUsers.push(action.payload);
        },
        userDisconnected: (users, { payload: id }) => {

            const updatedUsers = users.confirenceUsers.map((user) => (user.id === id ? { ...user, disconnected: true } : user));
            users.confirenceUsers = updatedUsers;



        },
        userAvatarAdded: (users, { payload: { id, avatarURL } }) => {

            let user;
            let index = 0;
            if (users.confirenceUsers.length > 0)
                while ((!user) && (index < users.confirenceUsers.length)) {
                    if (id === users.confirenceUsers[index].id) {
                        user = users.confirenceUsers[index];
                        users.confirenceUsers[index] = { ...users.confirenceUsers[index], avatarURL }
                    }
                    index++;
                }


        }

    }
});
export const {
    userAdded,
    userDisconnected,
    userAvatarAdded
} = slice.actions;

export default slice.reducer;