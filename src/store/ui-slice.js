import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    toggleSidebarIsOpen: false,
    sidebarWidth: 0,
    sidebarHeight: 0,
    fuzzySearchOutput: [],
  },
  reducers: {
    setToggleSidebarIsOpen(state, action) {
      state.toggleSidebarIsOpen = true;
    },
    setToggleSidebarIsClose(state, action) {
      state.toggleSidebarIsOpen = false;
    },
    setSidebarWidth(state, action) {
      state.sidebarWidth = action.payload;
    },
    setSidebarHeight(state, action) {
      state.sidebarHeight = action.payload;
    },
    setFuzzySearchOuput(state, action) {
      state.fuzzySearchOutput = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
