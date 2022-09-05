import { useRef, useState, useCallback, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapActions } from "../../store/map-slice";
import { fetchPoiGeojson } from "../../store/map-actions";

import "./MapView.css";
import "maplibre-gl/dist/maplibre-gl.css";
import Map, { NavigationControl, ScaleControl } from "react-map-gl";
import icons from "../../utils/icons";
import PoiLayer from "./Layer/PoiLayer";
import CompanyLayer from "./Layer/CompanyLayer";
import GoHomeContorl from "./Control/GoHomeControl";
import PoiPopup from "./Popup/PoiPopup";

// In order to solve the bug in production: Uncaught ReferenceError: y is not defined
// import maplibregl from "maplibre-gl";
// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from "!maplibre-gl"; // ! is important here
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";
maplibregl.workerClass = maplibreglWorker;

const MapView = () => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const [cursor, setCursor] = useState("auto");
  const viewState = useSelector((state) => state.map.viewState);
  const mapStyle = useSelector((state) => state.map.mapStyle);
  const hoveredFeature = useSelector((state) => state.map.hoveredFeature);
  const popupIsOpen = useSelector((state) => state.map.popupIsOpen);

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

    let hoveredStateId = null;

    mapRef.current.on("mouseenter", "poi", (e) => {
      // Change cursor
      mapRef.current.getCanvas().style.cursor = "pointer";

      // Change feature style
      let feature = e.features[0];
      if (hoveredStateId !== null) {
        mapRef.current.setFeatureState(
          { source: "poi", id: hoveredStateId },
          { hover: false }
        );
      }

      hoveredStateId = e.features[0].id;
      mapRef.current.setFeatureState(
        { source: "poi", id: hoveredStateId },
        { hover: true }
      );

      // Open popup window
      dispatch(mapActions.setPopupIsOpen(true));
      dispatch(mapActions.setHoveredFeature(feature));
    });

    mapRef.current.on("mouseleave", "poi", (e) => {
      // Change cursor
      mapRef.current.getCanvas().style.cursor = "auto";

      // Change feature style
      if (hoveredStateId !== null) {
        mapRef.current.setFeatureState(
          { source: "poi", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = null;

      // Close popup window
      // TODO: If mouse enter in popup window, don't close it
      dispatch(mapActions.setPopupIsOpen(false));
      dispatch(mapActions.setHoveredFeature(null));
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
        <GoHomeContorl
          position="bottom-right"
          displayControlsDefault={false}
          className="mapboxgl-ctrl-go-home"
          title="Go To Trend Micro"
          lnglat={[viewState.longitude, viewState.latitude]}
          zoom={viewState.zoom}
        />

        {/* Custom layers */}
        <PoiLayer />
        <CompanyLayer />

        {/* Popup */}
        {/* TODO: Calculate position of feature in window to control popup anchor? */}
        {popupIsOpen && (
          <PoiPopup
            feature={hoveredFeature}
            anchor="bottom"
            onClose={() => dispatch(mapActions.setPopupIsOpen(false))}
          />
        )}
      </Map>
    </Fragment>
  );
};

export default MapView;
