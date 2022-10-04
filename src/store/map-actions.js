import { mapActions } from "./map-slice";
import poiGeojsonUrl from "../assets/data/poi.geojson";
import companyGeojsonUrl from "../assets/data/company.geojson";
import * as turf from "@turf/turf";

const arraysEqual = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const getDuplicateCoordinates = (features) => {
  let duplicate_coordinates = [];

  features.forEach((f1) => {
    if (f1.geometry === null) return;
    features.forEach((f2) => {
      if (f2.geometry === null) return;
      if (f1 === f2) return;

      let f1_coords = f1.geometry.coordinates;
      let f2_coords = f2.geometry.coordinates;
      let distance = turf.distance(f1_coords, f2_coords);

      // If distance equal to zero, the coordinates of f1 and f2 are the same.
      if (distance === 0) {
        // Check the coordinates no in duplicate_coordinates array.
        let index = duplicate_coordinates.findIndex(
          (c) => c[0] === f1_coords[0] && c[1] === f1_coords[1]
        );

        let coordinatesNoInArray = index === -1;
        if (coordinatesNoInArray) {
          duplicate_coordinates.push(f1_coords);
        }
      }
    });
  });

  return duplicate_coordinates;
};

const resetDuplicatieCoordinates = (features, duplicate_coordinates) => {
  duplicate_coordinates.forEach((dc) => {
    let centerPoint = turf.point(dc);
    let radius = 0.015; // kilometers

    let targetFeatures = features.filter((f) => {
      if (f.geometry === null) return false;
      return arraysEqual(f.geometry.coordinates, dc);
    });

    // Generate regular polygons based on the number of features
    // Each LinearRing of a Polygon must have 4 or more Positions.
    let numberOfFeatures =
      targetFeatures.length < 4 ? 4 : targetFeatures.length;

    let regularPolygon = turf.circle(centerPoint, radius, {
      steps: numberOfFeatures,
    });

    // Use polygon nodes as new coordinates.
    targetFeatures.forEach((feature, index) => {
      feature.geometry.coordinates =
        regularPolygon.geometry.coordinates[0][index];
    });
  });
};

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
      let reversePoiGeojson = {
        ...poiGeojson,
        features: poiGeojson.features.reverse(),
      };

      // Remove row if name is null
      reversePoiGeojson = {
        ...reversePoiGeojson,
        features: reversePoiGeojson.features.filter(
          (f) => f.properties.name !== null
        ),
      };

      // Get duplicate coordinates in poi features.
      let duplicate_coordinates = getDuplicateCoordinates(
        reversePoiGeojson.features
      );

      // Reset duplicate coordinates with nodes of regular polygon
      resetDuplicatieCoordinates(
        reversePoiGeojson.features,
        duplicate_coordinates
      );

      let result = turf.clustersDbscan(reversePoiGeojson, 0.25, {
        mutate: true
      });

      dispatch(mapActions.setPoiGeojson(result));
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
