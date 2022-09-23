import { useRef, useState, useCallback, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapActions } from "../../store/map-slice";

import "./MapView.css";
import "maplibre-gl/dist/maplibre-gl.css";
import Map, {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
} from "react-map-gl";
import icons from "../../utils/icons";
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
  const clickedFeature = useSelector((state) => state.map.clickedFeature);
  const sidebarWidth = useSelector((state) => state.ui.sidebarWidth);
  const sidebarHeight = useSelector((state) => state.ui.sidebarHeight);
  const toggleSidebarIsOpen = useSelector(
    (state) => state.ui.toggleSidebarIsOpen
  );
  const windowSize = useSelector((state) => state.ui.windowSize);

  useEffect(() => {
    if (!toggleSidebarIsOpen) return;
    if (clickedFeature === null) return;

    // Use POI coordinates as the center of the map display
    // Consider the width and height of the sidebar to padding map
    if (isBrowser) {
      if (clickedFeature.geometry === null) return;
      mapRef.current.easeTo({
        center: clickedFeature.geometry.coordinates,
        padding: { left: sidebarWidth },
        duration: 1500,
      });
    }

    if (isMobile) {
      if (clickedFeature.geometry === null) return;
      mapRef.current.easeTo({
        center: clickedFeature.geometry.coordinates,
        padding: { bottom: sidebarHeight },
        duration: 1500,
      });
    }
  }, [clickedFeature, toggleSidebarIsOpen, sidebarWidth, sidebarHeight]);

  const loadIcons = useCallback(() => {
    for (const key of Object.keys(icons)) {
      let iconExists = mapRef.current.hasImage(key);
      if (iconExists) continue;

      let img = new Image(icons[key].width, icons[key].height);
      img.onload = () => mapRef.current.addImage(key, img);
      img.src = icons[key].file;
    }
  }, []);

  const onMapLoad = useCallback(() => {
    // Add all icons to map
    loadIcons();

    // Set cursor
    mapRef.current.on("dragstart", () => {
      setCursor("move");
    });

    mapRef.current.on("dragend", () => {
      setCursor("auto");
    });

    let hoveredFeatureId = null;
    let hoveredSource = null;
    let clickedFeature = null;

    // desktop-only - hover feature
    mapRef.current.on("mousemove", (e) => {
      if (isBrowser) {
        let features = mapRef.current.queryRenderedFeatures(e.point);
        if (features.length === 0) {
          // Change cursor
          mapRef.current.getCanvas().style.cursor = "auto";

          // Change feature style - Initialization
          if (hoveredFeatureId !== null) {
            mapRef.current.setFeatureState(
              { source: hoveredSource, id: hoveredFeatureId },
              { hover: false }
            );

            hoveredFeatureId = null;
            hoveredSource = null;
          }
          return;
        }

        let feature = features[0];

        // Change cursor
        mapRef.current.getCanvas().style.cursor = "pointer";

        // Change feature style
        if (hoveredFeatureId !== null) {
          mapRef.current.setFeatureState(
            { source: hoveredSource, id: hoveredFeatureId },
            { hover: false }
          );
        }

        // Overwrite with current hovered feature id and source
        hoveredFeatureId = feature.id;
        hoveredSource = feature.source;
        mapRef.current.setFeatureState(
          { source: feature.source, id: hoveredFeatureId },
          { hover: true }
        );
      }
    });

    const changeBackNormalStyle = (map, layerId) => {
      map.setLayoutProperty(layerId, "text-anchor", "top");
      map.setLayoutProperty(layerId, "text-offset", [0, 0.8]);
      map.setLayoutProperty(layerId, "text-font", ["Noto Sans Regular"]);
    };

    // click and select feature
    mapRef.current.on("click", (e) => {
      let mapInstance = mapRef.current.getMap();

      // Initialize source data
      mapInstance.getSource("selected_geojson").setData(null);

      var features = mapRef.current.queryRenderedFeatures(e.point);

      // The clicked position has no features
      if (features.length === 0) {
        // Close sidebar if click position without poi features
        dispatch(uiActions.setToggleSidebarIsClose());
        dispatch(mapActions.setClickedFeature(null));

        // Hide selected layer
        mapInstance.setLayoutProperty("selected_layer", "visibility", "none");

        // Change back to the original style
        if (clickedFeature !== null) {
          changeBackNormalStyle(mapInstance, clickedFeature.layer.id);
        }

        // Update clickedFeature value
        clickedFeature = null;
        dispatch(mapActions.setClickedFeature(null));
      }

      // The clicked position has features
      if (features.length !== 0) {
        // Get first feature as focus feature
        let feature = features[0];

        // Change back to the original style
        if (clickedFeature !== null) {
          // If click on same feature
          if (feature.id === clickedFeature.id) return;
          changeBackNormalStyle(mapInstance, clickedFeature.layer.id);
        }

        // Generate geojson from focus feature
        let selectedFeature = {
          type: "FeatureCollection",
          features: [
            {
              id: feature.id,
              geometry: feature.geometry,
              properties: feature.properties,
            },
          ],
        };

        // Update data of selected_geojson source
        mapInstance.getSource("selected_geojson").setData(selectedFeature);

        // Show selected layer
        mapInstance.setLayoutProperty(
          "selected_layer",
          "visibility",
          "visible"
        );

        // Update feature style in the same layer
        mapInstance.setLayoutProperty(feature.layer.id, "text-anchor", "left");
        mapInstance.setLayoutProperty(feature.layer.id, "text-offset", [1, 0]);
        mapInstance.setLayoutProperty(feature.layer.id, "text-font", [
          "Noto Sans Bold",
        ]);

        // Open sidebar if click position has poi features
        dispatch(uiActions.setToggleSidebarIsOpen());
        dispatch(mapActions.setClickedFeature(feature));
        clickedFeature = feature;
      }
    });
  }, [dispatch, loadIcons]);

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
        style={{ width: windowSize.width + "px", height: windowSize.height + "px" }}
        ref={mapRef}
        cursor={cursor}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="bottom-right"
          showUserHeading={true}
          showAccuracyCircle={true}
          positionOptions={{
            enableHighAccuracy: true,
          }}
          trackUserLocation={true}
          onGeolocate={(e) => {}}
          onTrackUserLocationStart={(e) => {}}
          onTrackUserLocationEnd={(e) => {}}
        />
        <ScaleControl />
        <GoHomeContorl
          position="bottom-right"
          displayControlsDefault={false}
          className="mapboxgl-ctrl-go-home"
          title="Go To Trend Micro"
          lnglat={[viewState.longitude, viewState.latitude]}
          zoom={viewState.zoom}
        />

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
