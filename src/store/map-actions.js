import { mapActions } from "./map-slice";
import poiGeojson from "../assets/data/poi.geojson";

export const fetchPoiGeojson = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(poiGeojson);

      if (!response.ok) {
        throw new Error("Could not fetch poi data from static file!");
      }

      const data = await response.json();
      return data;
    };

    try {
      const poiGeojson = await fetchData();
      dispatch(mapActions.setPoiGeojson(poiGeojson));
    } catch (error) {
      // TODO: ui error notification
      console.error(error);
    }
  };
};
