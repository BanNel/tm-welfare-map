import { mapActions } from "./map-slice";
import poiGeojsonUrl from "../assets/data/poi.geojson";
import companyGeojsonUrl from "../assets/data/company.geojson";

export const fetchPoiGeojson = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(poiGeojsonUrl);

      if (!response.ok) {
        throw new Error("Could not fetch poi data from static file!");
      }

      const data = await response.json();
      return data;
    };

    try {
      const poiGeojson = await fetchData();
      const reversePoiGeojson = {
        ...poiGeojson,
        features: poiGeojson.features.reverse(),
      };
      dispatch(mapActions.setPoiGeojson(reversePoiGeojson));
    } catch (error) {
      // TODO: ui error notification
      console.error(error);
    }
  };
};

export const fetchCompanyGeojson = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(companyGeojsonUrl);

      if (!response.ok) {
        throw new Error("Could not fetch poi data from static file!");
      }

      const data = await response.json();
      return data;
    };

    try {
      const companyGeojson = await fetchData();
      dispatch(mapActions.setCompanyGeojson(companyGeojson));
    } catch (error) {
      // TODO: ui error notification
      console.error(error);
    }
  };
};
