import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    toggleSidebarIsOpen: false,
  },
  reducers: {
    setToggleSidebarIsOpen(state, action) {
      state.toggleSidebarIsOpen = true;
    },
    setToggleSidebarIsClose(state, action) {
      state.toggleSidebarIsOpen = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice;
