import { Fragment } from "react";
import { Popup } from "react-map-gl";
import MediaCard from "./MediaCard";
import "./style.css";

const PoiPopup = (props) => {
  let feature = props.feature;
  let lng = feature.geometry.coordinates[0];
  let lat = feature.geometry.coordinates[1];
  return (
    <Fragment>
      <Popup
        longitude={lng}
        latitude={lat}
        onClose={props.onClose}
      >
        <MediaCard properties={feature.properties} />
      </Popup>
    </Fragment>
  );
};

export default PoiPopup;
