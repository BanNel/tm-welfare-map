import { Fragment } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import ClassChips from "../Sidebar/ClassChips";
import Highlighter from "react-highlight-words";

const SearchList = (props) => {
  const name = props.item.properties.name;
  const sub_name = props.item.properties.sub_name
    ? " - " + props.item.properties.sub_name
    : "";
  const full_name = name + sub_name;

  return (
    <Fragment>
      <Card
        onClick={props.onClick}
        sx={{
          "&:hover": {
            background: "#F1F1F1",
          },
          cursor: "pointer",
          overflow: "auto",
          width: "100%",
          borderRadius: 0,
        }}
      >
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            <Highlighter
              searchWords={props.keyword.split("")}
              autoEscape={true}
              textToHighlight={full_name}
            />
          </Typography>
          <ClassChips
            class={props.item.properties.class}
            subclass={props.item.properties.subclass}
          />

          <Divider sx={{ margin: "10px 0px 10px 0px" }} />

          <List>
            <ListItem disablePadding>
              <ListItemText
                primary={
                  <Highlighter
                    searchWords={props.keyword.split("")}
                    autoEscape={true}
                    textToHighlight={props.item.properties.description}
                  />
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default SearchList;
