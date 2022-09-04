import { useRef, useState, useCallback, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapActions } from "../../store/map-slice";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Map, { NavigationControl, ScaleControl } from "react-map-gl";

const MapView = () => {
  const dispatch = useDispatch();
  const mapRef = useRef();
  const [cursor, setCursor] = useState("auto");
  const viewState = useSelector((state) => state.map.viewState);
  const mapStyle = useSelector((state) => state.map.mapStyle);

  const onMapLoad = useCallback(() => {
    mapRef.current.on("dragstart", () => {
      setCursor("move");
    });

    mapRef.current.on("dragend", () => {
      setCursor("auto");
    });
  }, []);

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
      </Map>
    </Fragment>
  );
};

export default MapView;
