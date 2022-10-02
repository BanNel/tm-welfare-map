import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { mapActions } from "../../../store/map-slice";
import { uiActions } from "../../../store/ui-slice";
import { Autocomplete, TextField } from "@mui/material";
import Fuse from "fuse.js";
import SearchList from "../SearchList/SearchList";
import ReactGA from "react-ga4";

const eventTrack = (category, action, label) => {
  console.log("GA event:", category, ":", action, ":", label);
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

const CustomAutoComplete = (props) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const fuzzySearchOptions = {
    keys: ["properties.name", "properties.description"],
  };

  const onChangeHandler = (event, value) => {
    setIsOpen(false);
    // User clear input text
    if (value === null) {
      setInputValue("");

      // If user click clear button
      if (event.type === "click") {
        dispatch(mapActions.setClickedFeature(null));
        dispatch(uiActions.setToggleSidebarIsClose());
        dispatch(uiActions.setFuzzySearchOuput([]));
        dispatch(uiActions.setFuzzySearchKeyword(null));
      }
      return;
    }

    if (typeof value !== "object") {
      // If this value is not an object, it means that this value is typed by user.
      // This value is not in options list
      setInputValue(value);
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
    setIsOpen(true);

    if (event.type === "click") {
      dispatch(mapActions.setClickedFeature(null));
      dispatch(uiActions.setToggleSidebarIsClose());
      dispatch(uiActions.setFuzzySearchOuput([]));
      dispatch(uiActions.setFuzzySearchKeyword(null));
    }
  };

  const onKeydownHandler = (event) => {
    if (event.key === "Enter") {
      // Prevent's default 'Enter' behavior.
      event.defaultMuiPrevented = true;
      // your handler code
      dispatch(mapActions.setClickedFeature(null));

      setIsOpen(false);
      let fuzzySearchOutput = fuzzySearch(
        props.list,
        inputValue,
        fuzzySearchOptions
      );
      dispatch(uiActions.setFuzzySearchOuput(fuzzySearchOutput));
      dispatch(uiActions.setFuzzySearchKeyword(inputValue));
      dispatch(uiActions.setToggleSidebarIsOpen());
    }
  };

  const onBlurHandler = (event) => {
    dispatch(mapActions.setClickedFeature(null));

    setIsOpen(false);
    let fuzzySearchOutput = fuzzySearch(
      props.list,
      inputValue,
      fuzzySearchOptions
    );
    dispatch(uiActions.setFuzzySearchOuput(fuzzySearchOutput));
    dispatch(uiActions.setFuzzySearchKeyword(inputValue));
    dispatch(uiActions.setToggleSidebarIsOpen());
  };

  const fuzzySearch = (list, pattern, option) => {
    const fuse = new Fuse(list, option);
    eventTrack.bind(this, pattern, "Search Button", "Button");
    return fuse.search(pattern);
  };

  // Custom autocomplete list with fuzzy search by input value
  const filterOptions = (options, state) => {
    return fuzzySearch(options, inputValue, fuzzySearchOptions);
  };

  return (
    <Fragment>
      <Autocomplete
        id="search"
        open={isOpen}
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
          const name = option.item.properties.name;
          const sub_name = option.item.properties.sub_name
            ? " - " + option.item.properties.sub_name
            : "";
          let full_name = name + sub_name;
          return full_name;
        }}
        renderOption={(props, option) => {
          return (
            <li key={option.item.id} {...props}>
              <SearchList keyword={inputValue} item={option.item} />
            </li>
          );
        }}
        renderInput={(params) => {
          return <TextField {...params} label="Search TM Welfare Map" />;
        }}
        onKeyDown={onKeydownHandler}
        onBlur={onBlurHandler}
      />
    </Fragment>
  );
};

export default CustomAutoComplete;
