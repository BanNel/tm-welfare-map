import { Fragment, useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Map.css";
import GoHomeControl from "./Control/GoHomeControl";
import { mapActions } from "../../store/map-slice";
import { uiActions } from "../../store/ui-slice";
import usePrevious from "../../hooks/use-previous";
import Immutable from "immutable";
import diffStyles from "../../utils/diff";
import mapDefaultStyle from "./style.json";
import icons from "../../utils/icons";
import ReactGA from "react-ga4";
import { isBrowser, isMobile } from "react-device-detect";

// In order to solve the bug in production: Uncaught ReferenceError: y is not defined
// import maplibregl from "maplibre-gl";
// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from "!maplibre-gl"; // ! is important here
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";
import "maplibre-gl/dist/maplibre-gl.css";
maplibregl.workerClass = maplibreglWorker;

const Map = () => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const windowSize = useSelector((state) => state.ui.windowSize);
  const poiGeojson = useSelector((state) => state.map.poiGeojson);
  const companyGeojson = useSelector((state) => state.map.companyGeojson);
  const stylesheet = useSelector((state) => state.map.stylesheet);
  const mapStyle = usePrevious(stylesheet);
  const sidebarIsOpen = useSelector((state) => state.ui.sidebarIsOpen);
  const clickedFeature = useSelector((state) => state.map.clickedFeature);
  const previousClickedFeature = useSelector(
    (state) => state.map.previousClickedFeature
  );
  const sidebarWidth = useSelector((state) => state.ui.sidebarWidth);
  const sidebarHeight = useSelector((state) => state.ui.sidebarHeight);

  useEffect(() => {
    if (clickedFeature === null && previousClickedFeature == null) return;
    
    // Update style and selected layer if clickedFeature changes.
    let selectedLayerId = "selected_layer";
    let selectedSourceId = "selected_geojson";
    if (previousClickedFeature !== null) {
      let layerId = previousClickedFeature.properties.class;
      dispatch(mapActions.resetHighLightLayer(layerId));
    }

    if (clickedFeature === null) {
      dispatch(uiActions.setSidebarIsClose());
      dispatch(mapActions.hideLayer(selectedLayerId));
      return;
    }

    let selectedFeature = {
      type: "FeatureCollection",
      features: [
        {
          id: clickedFeature.id,
          geometry: clickedFeature.geometry,
          properties: clickedFeature.properties,
        },
      ],
    };

    dispatch(
      mapActions.setSourceData({
        id: selectedSourceId,
        data: selectedFeature,
      })
    );
    dispatch(uiActions.setSidebarIsOpen());
    dispatch(mapActions.showLayer(selectedLayerId));
    let layerId = clickedFeature.properties.class;
    dispatch(mapActions.highlightLayer(layerId));
  }, [dispatch, clickedFeature, previousClickedFeature]);

  useEffect(() => {
    let identity = setTimeout(() => {
      if (!sidebarIsOpen) return;
      if (clickedFeature === null) return;

      // Use POI coordinates as the center of the map display
      // Consider the width and height of the sidebar to padding map
      if (isBrowser) {
        if (clickedFeature.geometry === null) return;

        let currentZoom = map.getZoom();
        if (currentZoom < 1) currentZoom = 1;

        map.easeTo({
          center: clickedFeature.geometry.coordinates,
          padding: { left: sidebarWidth },
          zoom: currentZoom < 14 ? 14 : currentZoom,
          duration: 1500,
        });
      }

      if (isMobile) {
        if (clickedFeature.geometry === null) return;

        let currentZoom = map.getZoom();
        if (currentZoom < 1) currentZoom = 1;

        let offset = [0, -sidebarHeight / 2];

        if (windowSize.width > windowSize.height) {
          offset = [sidebarWidth / 2, 0];
        }

        map.easeTo({
          center: clickedFeature.geometry.coordinates,
          offset: offset,
          zoom: currentZoom < 14 ? 14 : currentZoom,
          duration: 1500,
        });
      }
    }, 100);

    return () => clearTimeout(identity);
  }, [
    map,
    sidebarIsOpen,
    clickedFeature,
    sidebarWidth,
    sidebarHeight,
    windowSize,
  ]);

  useEffect(() => {
    if (mapStyle === null) return;
    const oldStyle = mapStyle;
    const newStyle = stylesheet;

    if (!Immutable.is(oldStyle, newStyle)) {
      const changes = diffStyles(oldStyle.toJS(), newStyle.toJS());
      changes.forEach(function (change) {
        if (change.command === "setGeoJSONSourceData") {
          map.getSource(change.args[0]).setData(change.args[1]);
        } else {
          map[change.command].apply(map, change.args);
        }
      });
    }
  }, [map, stylesheet, mapStyle]);

  const loadIcons = useCallback((map) => {
    for (const key of Object.keys(icons)) {
      let iconExists = map.hasImage(key);
      if (iconExists) continue;

      let img = new Image(icons[key].width, icons[key].height);
      let sdf = icons[key].sdf;
      img.onload = () => map.addImage(key, img, { sdf: sdf, pixelRatio: 2 });
      img.src = icons[key].file;
    }
  }, []);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: mapDefaultStyle,
      center: [121.548388, 25.023129], // starting position [lng, lat]
      zoom: 14, // starting zoom
      attributionControl: false,
    });
    setMap(map);

    // Icon
    loadIcons(map);

    // Cursor
    map.getCanvas().style.cursor = "auto";

    map.on("load", () => {
      // When the map has finished loading.

      // Set style
      const style = map.getStyle();
      dispatch(mapActions.setStyle(style));

      // Different cursor
      map.on("dragstart", () => {
        map.getCanvas().style.cursor = "move";
      });

      map.on("dragend", () => {
        map.getCanvas().style.cursor = "auto";
      });

      // Sources
      map.getSource("poi_geojson").setData(poiGeojson);
      map.getSource("company_geojson").setData(companyGeojson);

      // Control
      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
        }),
        "bottom-right"
      );
      map.addControl(new maplibregl.NavigationControl(), "bottom-right");
      map.addControl(new maplibregl.ScaleControl(), "bottom-left");
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        "bottom-right"
      );
      map.addControl(
        new GoHomeControl({
          className: "maplibregl-ctrl-go-home",
          title: "Go To Trend Micro",
          lnglat: map.getCenter(),
          zoom: map.getZoom(),
        }),
        "bottom-right"
      );
    });

    let hoveredFeatureId = null;
    let hoveredSource = null;

    // desktop-only - hover feature
    map.on("mousemove", (e) => {
      if (isBrowser) {
        let features = map.queryRenderedFeatures(e.point);
        if (features.length === 0) {
          // Change cursor
          map.getCanvas().style.cursor = "auto";

          // Change feature style - Initialization
          if (hoveredFeatureId !== null) {
            map.setFeatureState(
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
        map.getCanvas().style.cursor = "pointer";

        // Change feature style
        if (hoveredFeatureId !== null) {
          map.setFeatureState(
            { source: hoveredSource, id: hoveredFeatureId },
            { hover: false }
          );
        }

        // Overwrite with current hovered feature id and source
        hoveredFeatureId = feature.id;
        hoveredSource = feature.source;
        map.setFeatureState(
          { source: feature.source, id: hoveredFeatureId },
          { hover: true }
        );
      }
    });

    map.on("click", (e) => {
      let features = map.queryRenderedFeatures(e.point);

      if (features.length === 0) {
        dispatch(mapActions.setClickedFeature(null));
      }

      if (features.length !== 0) {
        let feature = features[0];
        dispatch(mapActions.setClickedFeature(feature));

        // GA event
        ReactGA.event({
          category: "Click",
          action: "click_poi",
          label: feature.properties.name, // optional
        });
      }
    });

    // Clean up function
    return () => map.remove();
  }, [dispatch, loadIcons, poiGeojson, companyGeojson]);

  return (
    <Fragment>
      <div
        ref={mapRef}
        className="map"
        style={{
          width: windowSize.width + "px",
          height: windowSize.height + "px",
        }}
      />
    </Fragment>
  );
};

export default Map;
