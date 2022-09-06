import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { mapActions } from "../../../store/map-slice";
import { uiActions } from "../../../store/ui-slice";
import {
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import ClassChips from "../Sidebar/ClassChips";
import Highlighter from "react-highlight-words";
import Fuse from "fuse.js";

const CustomAutoComplete = (props) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  const onChangeHandler = (event, value) => {
    // User clear input text
    if (value === null) {
      setInputValue("");

      // If user click clear button
      if (event.type === "click") {
        dispatch(mapActions.setClickedFeature(null));
        dispatch(uiActions.setToggleSidebarIsClose());
      }
      return;
    }

    if (typeof value !== "object") {
      // If this value is not an object, it means that this value is typed by user.
      // This value is not in options list
      // setSelectedValue(value);
      setInputValue(value);
      // TODO: 客製化搜尋，透過該輸入進行 fuzzy search，將結果顯示於 sidebar 中。
    } else {
      // If this value is object, it means that this value is selected by user from options list.
      setInputValue(value.item.properties.name);

      // Update clicked feature and open sidebar
      dispatch(mapActions.setClickedFeature(value.item));
      dispatch(uiActions.setToggleSidebarIsOpen());
    }
  };

  const onInputChangeHandler = (event, value, reason) => {
    setInputValue(value);
  };

  // Custom autocomplete list with fuzzy search by input value
  const filterOptions = (options, state) => {
    const fuzzySearchOptions = {
      keys: ["properties.name", "properties.description"],
    };

    const fuse = new Fuse(options, fuzzySearchOptions);
    const pattern = inputValue;

    return fuse.search(pattern);
  };

  return (
    <Fragment>
      <Autocomplete
        id="search"
        freeSolo
        openOnFocus={true}
        onChange={onChangeHandler}
        onInputChange={onInputChangeHandler}
        options={props.list}
        filterOptions={filterOptions}
        getOptionLabel={(option) => {
          // If value is a string typed by user, return it directly
          if (typeof option !== "object") return option;

          // If value is object, return name of this feature.
          let name = option.item.properties.name;
          return name;
        }}
        renderOption={(props, option) => {
          return (
            <li key={option.item.id} {...props}>
              <List>
                <ClassChips
                  class={option.item.properties.class}
                  subclass={option.item.properties.subclass}
                />
                <ListItem disablePadding>
                  <ListItemText
                    primary={
                      // Highlight keywords (input value)
                      <Highlighter
                        searchWords={inputValue.split("")}
                        autoEscape={true}
                        textToHighlight={option.item.properties.name}
                      />
                    }
                    secondary={
                      // Highlight keywords (input value)
                      <Highlighter
                        searchWords={inputValue.split("")}
                        autoEscape={true}
                        textToHighlight={option.item.properties.description}
                      />
                    }
                  />
                </ListItem>
              </List>
            </li>
          );
        }}
        renderInput={(params) => {
          return <TextField {...params} label="Search TM Welfare Map" />;
        }}
      />
    </Fragment>
  );
};

export default CustomAutoComplete;
