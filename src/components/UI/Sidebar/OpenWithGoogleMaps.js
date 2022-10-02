import { Chip } from "@mui/material";
import { Fragment } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import ReactGA from 'react-ga4';

const OpenWithGoogleMaps = (props) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${props.name}`;
  ReactGA.event({
    category: "click",
    action: "Click POI",
    label: props.name, // optional
  });
  console.log("console log: Click POI");
  return (
    <Fragment>
      <Chip
        onClick={() => {
          window.open(url, "_blank");
        }}
        icon={<PushPinIcon fontSize="small" />}
        label="Open With Google Maps"
        color="primary"
        variant="outlined"
      />
    </Fragment>
  );
};

export default OpenWithGoogleMaps;
