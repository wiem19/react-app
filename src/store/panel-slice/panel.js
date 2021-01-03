import { createSlice } from "@reduxjs/toolkit";
import twemoji from "twemoji";

const convert = (hex_val) =>
    twemoji.convert.fromCodePoint(hex_val);


const slice = createSlice({
    name: "panel",
    initialState: {
        panelShown: false,
        gifPanelShown: false,
        smileysPanelShown: true,
        supportedEmojis: [
            { class: "icon-f60a", path: [1, 2, 3, 4], symbole: convert("1f60a") },
            { class: "icon-f60b", path: [1, 2, 3, 4], symbole: convert("1f60b") },
            { class: "icon-f62d", path: [1, 2, 3, 4, 5, 6], symbole: convert("1f62d") },
            { class: "icon-f605", path: [1, 2, 3, 4], symbole: convert("1f605") },
            { class: "icon-f606", path: [1, 2, 3, 4], symbole: convert("1f606") },
            { class: "icon-f609", path: [1, 2, 3], symbole: convert("1f609") },
            { class: "icon-f616", path: [1, 2], symbole: convert("1f616") },
            { class: "icon-f632", path: [1, 2, 3, 4, 5, 6], symbole: convert("1f632") },
            { class: "icon-f642", path: [1, 2, 3, 4], symbole: convert("1f642") },
            { class: "icon-2764", path: [1], symbole: convert("2764") },
        ],
    },
    reducers: {
        panelToggled: (panel, { payload }) => {
            panel.panelShown = !panel.panelShown
        },
        gifsPanelShow: (panel, { payload }) => {
            panel.gifPanelShown = true;
            panel.smileysPanelShown = false;
        },
        smileysPanelShow: (panel, { payload }) => {
            panel.gifPanelShown = false;
            panel.initialStatesmileysPanelShown = true;
        }
    }
});

export const { panelToggled, gifsPanelShow, smileysPanelShow } = slice.actions;

export default slice.reducer;