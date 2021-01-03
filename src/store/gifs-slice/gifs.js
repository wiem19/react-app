import config from "../../services/config.apis.json";
import {
    createSlice
} from "@reduxjs/toolkit";
// import moment from "moment";
import { apiCallBegan } from "../middleware/apiActions";


const slice = createSlice({

    name: "gifs",
    initialState: {
        gifsList: [],
        meta: {},
        loading: false
    },

    reducers: {

        gifsRequested: (gifs) => {
            gifs.gifsList = [];
            gifs.loading = true;
        },

        gifsReceived: (gifs, { payload: { data: res } }) => {
            gifs.gifsList = res.data;
            gifs.meta = res.meta;
            gifs.loading = false;

        },

        gifsRequestFailed: (gifs) => {
            gifs.loading = false;
        },

    }

});




export const loadGifs = (search) => (dispatch, getState) => {
    let gifsUrl;
    const queryOptions = {
        "q": search, //Search
        "limit": 8, //number of gifs
        "offset": 1, // starting point
        "lang": "fr"
    }


    const query = Object.keys(queryOptions)
        .map(key => `${key}=${queryOptions[key]}`)
        .join('&');

    if ((search !== undefined) && (search.trim() !== "")) {
        console.log(query);
        gifsUrl = `${config.gifsUrlSearch}&${query}`;
    } else {
        gifsUrl = `${config.gifsUrlTrending}&${query}`;
    }
    return dispatch(
        apiCallBegan({
            url: gifsUrl,
            onStart: gifsRequested.type,
            onSuccess: gifsReceived.type,
            onError: gifsRequestFailed.type,
        })
    );
};





export const {
    gifsReceived,
    gifsRequested,
    gifsRequestFailed,

} = slice.actions;

export default slice.reducer;