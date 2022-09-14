import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DiscountIcon from "@mui/icons-material/Discount";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ClassChips from "./ClassChips";
import OpenWithGoogleMaps from "./OpenWithGoogleMaps";

export default function MediaCard(props) {
  // TODO: focus feature 更新後，初始化 Card scroll。
  return (
    <Card
      sx={{ overflow: "auto", width: "100%", height: "100%", borderRadius: 0 }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.feature.properties.name}
        </Typography>
        <ClassChips
          class={props.feature.properties.class}
          subclass={props.feature.properties.subclass}
        />

        <Divider sx={{ margin: "10px 0px 10px 0px" }} />

        <OpenWithGoogleMaps name={props.feature.properties.name} />

        <Divider sx={{ margin: "10px 0px 10px 0px" }} />

        <List>
          <ListItem disablePadding>
              <ListItemIcon>
                <LocationOnIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={props.feature.properties.address} />
          </ListItem>
          <Divider sx={{margin:"10px 0px 10px 0px"}} component="li" />
          <ListItem disablePadding>
              <ListItemIcon>
                <DiscountIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={props.feature.properties.description} />
          </ListItem>
          <Divider sx={{margin:"10px 0px 10px 0px"}} component="li" />
          <ListItem disablePadding>
              <ListItemIcon>
                <DateRangeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={props.feature.properties.expiration} />
          </ListItem>
          <Divider sx={{margin:"10px 0px 10px 0px"}} component="li" />
          <ListItem disablePadding>
              <ListItemIcon>
                <DateRangeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={props.feature.properties.start_date} />
          </ListItem>
          <Divider sx={{margin:"10px 0px 10px 0px"}} component="li" />
          <ListItem disablePadding>
              <ListItemIcon>
                <DateRangeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={props.feature.properties.shop_url} />
          </ListItem>
          <Divider sx={{margin:"10px 0px 10px 0px"}} component="li" />
          <ListItem disablePadding>
              <ListItemIcon>
                <DateRangeIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={props.feature.properties.contract_url} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
