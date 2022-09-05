import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./map-slice";
import uiSlice from "./ui-slice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    map: mapSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
