import { createSlice } from "@reduxjs/toolkit";
import { fromJS } from "immutable";
import deepEqual from "../utils/deep_equal";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    stylesheet: null,
    poiGeojson: null,
    companyGeojson: null,
    previousClickedFeature: null,
    clickedFeature: null,
  },
  reducers: {
    setStyle(state, action) {
      state.stylesheet = fromJS(action.payload);
    },
    hideLayer(state, action) {
      // 'layout': {
      //   'visibility': 'none'
      // },
      if (state.stylesheet === null) return;
      const id = action.payload;
      let newStyle = state.stylesheet.toJS();
      let targetLayer = newStyle.layers.find((layer) => layer.id === id);
      targetLayer.layout["visibility"] = "none";
      
      state.stylesheet = fromJS(newStyle);
    },
    showLayer(state, action) {
      // 'layout': {
      //   'visibility': 'visible'
      // },
      if (state.stylesheet === null) return;
      const id = action.payload;
      let newStyle = state.stylesheet.toJS();
      let targetLayer = newStyle.layers.find((layer) => layer.id === id);

      if (targetLayer.layout.hasOwnProperty("visibility")) {
        delete targetLayer.layout["visibility"];
      }

      state.stylesheet = fromJS(newStyle);
    },
    highlightLayer(state, action) {
      if (state.stylesheet === null) return;
      const id = action.payload;
      let newStyle = state.stylesheet.toJS();

      let targetLayer = newStyle.layers.find((layer) => layer.id === id);
      targetLayer.layout["text-anchor"] = "left";
      targetLayer.layout["text-offset"] = [1, 0];
      targetLayer.layout["text-font"] = ["Noto Sans Bold"];

      state.stylesheet = fromJS(newStyle);
    },
    resetHighLightLayer(state, action) {
      if (state.stylesheet === null) return;
      const id = action.payload;
      let newStyle = state.stylesheet.toJS();

      let targetLayer = newStyle.layers.find((layer) => layer.id === id);
      targetLayer.layout["text-anchor"] = "top";
      targetLayer.layout["text-offset"] = [0, 0.8];
      targetLayer.layout["text-font"] = ["Noto Sans Regular"];

      state.stylesheet = fromJS(newStyle);
    },
    setSourceData(state, action) {
      if (state.stylesheet === null) return;
      const id = action.payload.id;
      let newStyle = state.stylesheet.toJS();

      newStyle.sources[id].data = action.payload.data;

      state.stylesheet = fromJS(newStyle);
    },
    setPoiGeojson(state, action) {
      state.poiGeojson = action.payload;
    },
    setCompanyGeojson(state, action) {
      state.companyGeojson = action.payload;
    },
    setClickedFeature(state, action) {
      let newFeature = action.payload;
      if (deepEqual(newFeature, state.clickedFeature)) return;
      state.previousClickedFeature = state.clickedFeature;
      state.clickedFeature = newFeature;
    },
  },
});

export const mapActions = mapSlice.actions;
export default mapSlice;
