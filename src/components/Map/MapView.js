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
import { uiActions } from "../../store/ui-slice";
import { isBrowser, isMobile } from "react-device-detect";
maplibregl.workerClass = maplibreglWorker;

const MapView = () => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const [cursor, setCursor] = useState("auto");
  const viewState = useSelector((state) => state.map.viewState);
  const mapStyle = useSelector((state) => state.map.mapStyle);
  const hoveredFeature = useSelector((state) => state.map.hoveredFeature);
  const sidebarWidth = useSelector((state) => state.ui.sidebarWidth);
  const sidebarHeight = useSelector((state) => state.ui.sidebarHeight);

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

    let hoveredFeatureId = null;
    let clickedFeatureId = null;

    // mouseenter and mouseleave are desktop-only events
    mapRef.current.on("mouseenter", "poi", (e) => {
      if (isBrowser) {
        // Change cursor
        mapRef.current.getCanvas().style.cursor = "pointer";

        // Change feature style
        if (hoveredFeatureId !== null) {
          mapRef.current.setFeatureState(
            { source: "poi", id: hoveredFeatureId },
            { hover: false }
          );
        }

        hoveredFeatureId = e.features[0].id;
        mapRef.current.setFeatureState(
          { source: "poi", id: hoveredFeatureId },
          { hover: true }
        );
      }
    });

    // mouseenter and mouseleave are desktop-only events
    mapRef.current.on("mouseleave", "poi", (e) => {
      if (isBrowser) {
        // Change cursor
        mapRef.current.getCanvas().style.cursor = "auto";

        // Change feature style
        if (hoveredFeatureId !== null) {
          mapRef.current.setFeatureState(
            { source: "poi", id: hoveredFeatureId },
            { hover: false }
          );
        }
        hoveredFeatureId = null;
      }
    });

    mapRef.current.on("click", (e) => {
      var features = mapRef.current.queryRenderedFeatures(e.point, {
        layers: ["poi"],
      });

      // Close sidebar if click position without poi feature
      if (features.length === 0) {
        dispatch(uiActions.setToggleSidebarIsClose());
        dispatch(mapActions.setClickedFeature(null));
        if (clickedFeatureId !== null) {
          clickedFeatureId = null;
        }
      }

      // Open sidebar based on clicked feature information
      if (features.length !== 0) {
        let feature = features[0];
        // TODO: 恢復 focus feature 原本的 icon
        clickedFeatureId = feature.id;
        // TODO: 更換當前 focus feature 的 icon
        dispatch(mapActions.setClickedFeature(feature));
        dispatch(uiActions.setToggleSidebarIsOpen());

        // Use POI coordinates as the center of the map display
        // Consider the width and height of the sidebar to padding map
        if (isBrowser) {
          mapRef.current.easeTo({
            center: feature.geometry.coordinates,
            padding: { left: sidebarWidth },
            duration: 1000,
          });
        }

        if (isMobile) {
          mapRef.current.easeTo({
            center: feature.geometry.coordinates,
            padding: { bottom: sidebarHeight },
            duration: 1000,
          });
        }
      }
    });
  }, [dispatch, sidebarWidth, sidebarHeight]);

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
        {hoveredFeature !== null && (
          <PoiPopup
            feature={hoveredFeature}
            onClose={() => dispatch(mapActions.setHoveredFeature(null))}
          />
        )}
      </Map>
    </Fragment>
  );
};

export default MapView;
