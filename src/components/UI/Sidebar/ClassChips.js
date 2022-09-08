import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import icons from "../../../utils/icons";

export default function ClassChips(props) {
  return (
    <Stack direction="row" spacing={1}>
      <Chip color="primary" label={props.class} variant="outlined" />
      <Chip
        avatar={<Avatar alt={props.subclass} src={icons[props.subclass].file} />}
        label={props.subclass}
        variant="outlined"
      />
    </Stack>
  );
}
