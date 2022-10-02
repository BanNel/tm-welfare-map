import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DiscountIcon from "@mui/icons-material/Discount";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ClassChips from "./ClassChips";
import OpenWithGoogleMaps from "./OpenWithGoogleMaps";
import DescriptionIcon from "@mui/icons-material/Description";
import ShareIcon from "@mui/icons-material/Share";
import Tooltip from "@mui/material/Tooltip";

export default function MediaCard(props) {
  // TODO: focus feature 更新後，初始化 Card scroll。

  const contract_date =
    props.feature.properties.start_date === undefined
      ? props.feature.properties.expiration
      : props.feature.properties.start_date +
        " - " +
        props.feature.properties.expiration;

  const name = props.feature.properties.name;
  const sub_name = props.feature.properties.sub_name
    ? " - " + props.feature.properties.sub_name
    : "";
  const full_name = name + sub_name;

  return (
    <Card
      sx={{ overflow: "auto", width: "100%", height: "100%", borderRadius: 0 }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {full_name}
        </Typography>
        <ClassChips
          class={props.feature.properties.class}
          subclass={props.feature.properties.subclass}
        />

        <Divider sx={{ margin: "10px 0px 10px 0px" }} />

        <OpenWithGoogleMaps name={full_name} />

        <Divider sx={{ margin: "10px 0px 10px 0px" }} />

        <List>
          <ListItem disablePadding>
            <ListItemIcon>
              <Tooltip title="地址" arrow>
                <LocationOnIcon color="primary" />
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary={props.feature.properties.address} />
          </ListItem>
          <Divider sx={{ margin: "10px 0px 10px 0px" }} component="li" />
          <ListItem disablePadding>
            <ListItemIcon>
              <Tooltip title="優惠" arrow>
                <DiscountIcon color="primary" />
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary={props.feature.properties.description} />
          </ListItem>
          <Divider sx={{ margin: "10px 0px 10px 0px" }} component="li" />
          <ListItem disablePadding>
            <ListItemIcon>
              <Tooltip title="合約到期日" arrow>
                <DateRangeIcon color="primary" />
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary={contract_date} />
          </ListItem>
          <Divider sx={{ margin: "10px 0px 10px 0px" }} component="li" />
          <ListItem disablePadding>
            <ListItemIcon>
              <Tooltip title="店家連結" arrow>
                <ShareIcon color="primary" />
              </Tooltip>
            </ListItemIcon>
            {props.feature.properties.shop_url !== undefined && (
              <Link
                href={props.feature.properties.shop_url}
                target="_blank"
                rel="noopener"
                underline="none"
              >
                <ListItemText primary="店家連結" />
              </Link>
            )}
          </ListItem>
          <Divider sx={{ margin: "10px 0px 10px 0px" }} component="li" />
          <ListItem disablePadding>
            <ListItemIcon>
              <Tooltip title="合約連結" arrow>
                <DescriptionIcon color="primary" />
              </Tooltip>
            </ListItemIcon>

            {props.feature.properties.contract_url !== undefined && (
              <Link
                href={props.feature.properties.contract_url}
                target="_blank"
                rel="noopener"
                underline="none"
              >
                <ListItemText primary="合約連結" />
              </Link>
            )}
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
