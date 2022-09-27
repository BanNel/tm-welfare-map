import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Grid, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Stack from "@mui/material/Stack";
import CustomAutoComplete from "./CustomAutoComplete";
import { useDispatch } from "react-redux";
import { uiActions } from "../../../store/ui-slice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const poiGeojson = useSelector((state) => state.map.poiGeojson);

  const toggleDrawer = () => {
    dispatch(uiActions.toggleDrawer());
  };

  return (
    <Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container style={{ position: "fixed", zIndex: 2 }}>
          <Grid item xs={12} sm={12} md={3}>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              sx={{
                margin: "15px 10px 10px 10px",
                boxShadow: 3,
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
            >
              <IconButton
                sx={{ p: "10px" }}
                aria-label="menu"
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
              <Grid item xs={12}>
                {poiGeojson !== null && (
                  <CustomAutoComplete
                    list={poiGeojson.features.filter(
                      (f) => f.properties.status === "Active"
                    )}
                  />
                )}
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default SearchBar;
