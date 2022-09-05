import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function MediaCard(props) {
  return (
    <Card sx={{ width: 350, boxShadow: 5 }}>
      <CardMedia
        component="img"
        height="140"
        image="https://avatars.githubusercontent.com/u/24354061?v=4"
        alt="image"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.properties.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.properties.description}
        </Typography>
        <Divider sx={{ p: 1 }} />
        <Typography sx={{ pt: 1 }} variant="body2" color="text.secondary">
          地址：{props.properties.address}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>
  );
}
