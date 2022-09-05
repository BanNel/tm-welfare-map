import { Fragment } from "react";
import { Box, Grid } from "@mui/material";

import "./ToggleSidebar.css";
import { useSelector } from "react-redux";
import MediaCard from "./MediaCard";

const ToggleSidebar = () => {
  const toggleSidebarIsOpen = useSelector(
    (state) => state.ui.toggleSidebarIsOpen
  );
  const clickedFeature = useSelector((state) => state.map.clickedFeature);
  let isCollasped = toggleSidebarIsOpen ? "" : "collapsed";

  return (
    <Fragment>
      <Grid sx={{  flexGrow: 1 }} container>
        {/* Desktop */}
        <Grid item sx={{ display: { xs: "none", md: "block" } }}>
          <Box id="left" className={`sidebar flex-center left ${isCollasped}`}>
            <Box className="sidebar-content rounded-rect flex-center">
              {clickedFeature !== null && (
                <MediaCard properties={clickedFeature.properties} />
              )}
            </Box>
          </Box>
        </Grid>
        {/* Mobile */}
        <Grid item sx={{ display: { xs: "block", md: "none" } }}>
          <Box
            id="bottom"
            className={`sidebar_bottom flex-center bottom ${isCollasped}`}
          >
            <Box className="sidebar-content rounded-rect flex-center">
              {clickedFeature !== null && (
                <MediaCard properties={clickedFeature.properties} />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
};
export default ToggleSidebar;
