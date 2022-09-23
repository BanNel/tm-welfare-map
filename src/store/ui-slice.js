import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    toggleSidebarIsOpen: false,
    sidebarWidth: 0,
    sidebarHeight: 0,
    windowSize: null,
    fuzzySearchKeyword: null,
    fuzzySearchOutput: [],
    drawerIsOpen: false,
    taxIdModalIsOpen: false,
    currentTaxId: { name: "", number: null },
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
    setFuzzySearchKeyword(state, action) {
      state.fuzzySearchKeyword = action.payload;
    },
    toggleDrawer(state, action) {
      state.drawerIsOpen = !state.drawerIsOpen;
    },
    toggleTaxIdModal(state, action) {
      state.taxIdModalIsOpen = !state.taxIdModalIsOpen;
    },
    setCurrentTaxId(state, action) {
      state.currentTaxId = action.payload;
    },
    setWindowSize(state, action) {
      state.windowSize = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
