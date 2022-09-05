import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Source, Layer } from "react-map-gl";

const layerStyle = {
  id: "poi",
  type: "symbol",
  layout: {
    "text-anchor": "top",
    "text-field": "{name}",
    "text-font": ["Noto Sans Regular"],
    "text-offset": [0, 0.6],
    "text-padding": 2,
    "text-size": 14,
    "icon-image": "{subclass}",
    "text-max-width": 30,
  },
  paint: {
    "text-color": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      "rgba(3, 117, 214, 1)",
      "#B45118",
    ],
    "text-halo-blur": 0.5,
    "text-halo-color": "#ffffff",
    "text-halo-width": 1,
  },
};

const PoiLayer = () => {
  const poiGeojson = useSelector((state) => state.map.poiGeojson);
  return (
    <Fragment>
      <Source id="poi" type="geojson" data={poiGeojson}>
        <Layer {...layerStyle} />
      </Source>
    </Fragment>
  );
};

export default PoiLayer;
