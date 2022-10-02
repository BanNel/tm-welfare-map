import { Chip } from "@mui/material";
import { Fragment } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import ReactGA from 'react-ga4';

const OpenWithGoogleMaps = (props) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${props.name}`;

  return (
    <Fragment>
      <Chip
        onClick={() => {
          window.open(url, "_blank");
          ReactGA.event({
            category: "Click",
            action: "open_with_google_maps",
            label: props.name, // optional
          });
         // console.log("console log: open_with_google_maps");
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
