import { configureStore } from "@reduxjs/toolkit";
import mapSlice from "./map-slice";

const store = configureStore({
  reducer: {
    map: mapSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
