import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DiscountIcon from "@mui/icons-material/Discount";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ClassChips from "./ClassChips";

export default function MediaCard(props) {
  // TODO: focus feature 更新後，初始化 Card scroll。
  return (
    <Card
      sx={{ overflow: "auto", width: "100%", height: "100%", borderRadius: 0 }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.properties.name}
        </Typography>
        <ClassChips
          class={props.properties.class}
          subclass={props.properties.subclass}
        />
        <Divider sx={{ margin: "20px 0px 20px 0px" }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton disableGutters>
              <ListItemIcon>
                <LocationOnIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={props.properties.address} />
            </ListItemButton>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem disablePadding>
            <ListItemButton disableGutters>
              <ListItemIcon>
                <DiscountIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={props.properties.description} />
            </ListItemButton>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem disablePadding>
            <ListItemButton disableGutters>
              <ListItemIcon>
                <DateRangeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={props.properties.expiration} />
            </ListItemButton>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
