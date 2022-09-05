import { createSlice } from "@reduxjs/toolkit";

const defaultViewState = {
  latitude: 25.02312941733473,
  longitude: 121.54838821352193,
  zoom: 14,
  customAttribution:
    '<a href="https://www.trendmicro.com/" target="_blank">&copy; Trend Micro Inc.</a> ',
};

const defaultMapStyle = {
  version: 8,
  sources: {
    stamen_toner: {
      type: "raster",
      tiles: ["https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    },
  },
  sprite: "",
  glyphs: "https://yuchuntsao.github.io/fonts/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "background",
      type: "background",
      minzoom: 0,
      paint: {
        "background-color": "rgba(255, 255, 255, 1)",
      },
    },
    {
      id: "stamen_toner",
      type: "raster",
      source: "stamen_toner",
      paint: {
        "raster-opacity": 0.3,
      },
    },
  ],
};

const mapSlice = createSlice({
  name: "map",
  initialState: {
    viewState: defaultViewState,
    mapStyle: defaultMapStyle,
    poiGeojson: null,
    hoveredFeature: null,
    popupIsOpen: false,
  },
  reducers: {
    setViewState(state, action) {
      state.viewState = action.payload;
    },
    setPoiGeojson(state, action) {
      state.poiGeojson = action.payload;
    },
    setHoveredFeature(state, action) {
      state.hoveredFeature = action.payload;
    },
    setPopupIsOpen(state, action) {
      state.popupIsOpen = action.payload;
    },
  },
});

export const mapActions = mapSlice.actions;
export default mapSlice;
