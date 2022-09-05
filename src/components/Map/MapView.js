import { useRef, useState, useCallback, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapActions } from "../../store/map-slice";
import { fetchPoiGeojson } from "../../store/map-actions";

import "maplibre-gl/dist/maplibre-gl.css";
import Map, { NavigationControl, ScaleControl } from "react-map-gl";
import icons from "../../utils/icons";
import PoiLayer from "./Layer/PoiLayer";
import CompanyLayer from "./Layer/CompanyLayer";

// In order to solve the bug in production: Uncaught ReferenceError: y is not defined
// import maplibregl from "maplibre-gl";
// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from '!maplibre-gl';      // ! is important here
import maplibreglWorker from 'maplibre-gl/dist/maplibre-gl-csp-worker';
maplibregl.workerClass = maplibreglWorker;

const MapView = () => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const [cursor, setCursor] = useState("auto");
  const viewState = useSelector((state) => state.map.viewState);
  const mapStyle = useSelector((state) => state.map.mapStyle);

  const onMapLoad = useCallback(() => {
    // Add all icons to map
    for (const key of Object.keys(icons)) {
      let img = new Image(20, 20);
      img.onload = () => mapRef.current.addImage(key, img);
      img.src = icons[key];
    }

    // Fetch poi geojson from static file
    dispatch(fetchPoiGeojson());

    // Set cursor
    mapRef.current.on("dragstart", () => {
      setCursor("move");
    });

    mapRef.current.on("dragend", () => {
      setCursor("auto");
    });
  }, [dispatch]);

  const onMove = useCallback(
    (e) => {
      dispatch(mapActions.setViewState(e.viewState));
    },
    [dispatch]
  );

  return (
    <Fragment>
      <Map
        {...viewState}
        mapStyle={mapStyle}
        mapLib={maplibregl}
        onLoad={onMapLoad}
        onMove={onMove}
        style={{ width: "100vw", height: "100vh" }}
        ref={mapRef}
        cursor={cursor}
      >
        <NavigationControl position="bottom-right" />
        <ScaleControl />

        {/* Custom layers */}
        <PoiLayer />
        <CompanyLayer />
      </Map>
    </Fragment>
  );
};

export default MapView;
