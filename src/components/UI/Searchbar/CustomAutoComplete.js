import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const clickedFeature = useSelector((state) => state.map.clickedFeature);
  const fuzzySearchOptions = {
    keys: [
      { name: "properties.name", weight: 0.5 },
      { name: "properties.sub_name", weight: 0.3 },
      { name: "properties.description", weight: 0.2 },
    ],
  };
  const fuzzySearchKeyword = useSelector(
    (state) => state.ui.fuzzySearchKeyword
  );
  const fuzzySearchOutput = useSelector((state) => state.ui.fuzzySearchOutput);

  useEffect(() => {
    if (clickedFeature === null) {
      setInputValue("");
      return;
    }

    const name = clickedFeature.properties.name;
    const sub_name = clickedFeature.properties.sub_name
      ? " - " + clickedFeature.properties.sub_name
      : "";
    const full_name = name + sub_name;
    setInputValue(full_name);
    setIsOpen(false);
  }, [clickedFeature]);

  useEffect(() => {
    if (fuzzySearchOutput.length === 0) return;
    if (clickedFeature === null && fuzzySearchOutput.length !== 0) {
      setIsOpen(false);
      setInputValue(fuzzySearchKeyword);
    }
  }, [dispatch, fuzzySearchKeyword, fuzzySearchOutput, clickedFeature]);

  const onChangeHandler = (event, value) => {
    // User selected an POI in SearchList
    setIsOpen(false);

    // User clear input text (Delete or click clear button)
    if (value === null) {
      setInputValue("");
      dispatch(mapActions.setClickedFeature(null));
      dispatch(uiActions.setSidebarIsClose());
      dispatch(uiActions.setFuzzySearchOutput([]));
      dispatch(uiActions.setFuzzySearchKeyword(null));
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
      dispatch(uiActions.setSidebarIsOpen());
    }
  };

  const onInputChangeHandler = (event, value, reason) => {
    if (value.trim() === "") {
      setInputValue("");
      setIsOpen(false);
      dispatch(uiActions.setFuzzySearchOutput([]));
      dispatch(uiActions.setFuzzySearchKeyword(null));
      dispatch(uiActions.setSidebarIsClose());
    }

    if (value.trim() !== "") {
      // Input text has value
      setInputValue(value);
      setIsOpen(true);
    }
  };

  const onKeydownHandler = (event) => {
    if (event.key === "Enter") {
      let fuzzySearchOutput = fuzzySearch(
        props.list,
        inputValue,
        fuzzySearchOptions
      );
      dispatch(uiActions.setFuzzySearchOutput(fuzzySearchOutput));
      dispatch(uiActions.setFuzzySearchKeyword(inputValue));

      if (clickedFeature !== null) {
        dispatch(mapActions.setClickedFeature(null));
      }
    }
  };

  const onBlurHandler = (event) => {
    // element has lost focus
    setIsOpen(false);
  };

  const onFocusHandler = () => {
    setIsOpen(true);
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
        inputValue={inputValue}
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
        onFocus={onFocusHandler}
      />
    </Fragment>
  );
};

export default CustomAutoComplete;
