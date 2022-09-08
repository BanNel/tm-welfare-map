import { createSlice } from "@reduxjs/toolkit";
import { defaultMapStyle } from "./map-style";

const defaultViewState = {
  latitude: 25.02312941733473,
  longitude: 121.54838821352193,
  zoom: 14,
  customAttribution:
    '<a href="https://www.trendmicro.com/" target="_blank">&copy; Trend Micro Inc.</a> ',
};

const mapSlice = createSlice({
  name: "map",
  initialState: {
    viewState: defaultViewState,
    mapStyle: defaultMapStyle,
    poiGeojson: null,
    companyGeojson: null,
    hoveredFeature: null,
    clickedFeature: null,
  },
  reducers: {
    setViewState(state, action) {
      state.viewState = action.payload;
    },
    setPoiGeojson(state, action) {
      state.poiGeojson = action.payload;

      // Update mapStyle poi geojson source
      state.mapStyle = {
        ...state.mapStyle,
        sources: {
          ...state.mapStyle.sources,
          poi_geojson: {
            ...state.mapStyle.sources.poi_geojson,
            data: action.payload,
          },
        },
      };
    },
    setCompanyGeojson(state, action) {
      state.companyGeojson = action.payload;

      // Update mapStyle company geojson source
      state.mapStyle = {
        ...state.mapStyle,
        sources: {
          ...state.mapStyle.sources,
          company_geojson: {
            ...state.mapStyle.sources.company_geojson,
            data: action.payload,
          },
        },
      };
    },
    setHoveredFeature(state, action) {
      state.hoveredFeature = action.payload;
    },
    setClickedFeature(state, action) {
      state.clickedFeature = action.payload;
    },
  },
});

export const mapActions = mapSlice.actions;
export default mapSlice;
