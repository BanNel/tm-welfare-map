import { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Divider } from "@mui/material";
import MediaCard from "./MediaCard";
import { isBrowser, isMobile } from "react-device-detect";

import "./ToggleSidebar.css";
import { uiActions } from "../../../store/ui-slice";
import { mapActions } from "../../../store/map-slice";
import SearchList from "../SearchList/SearchList";

const ToggleSidebar = () => {
  const dispatch = useDispatch();
  const toggleSidebarIsOpen = useSelector(
    (state) => state.ui.toggleSidebarIsOpen
  );
  const clickedFeature = useSelector((state) => state.map.clickedFeature);
  let isCollasped = toggleSidebarIsOpen ? "" : "collapsed";
  const fuzzySearchKeyword = useSelector(
    (state) => state.ui.fuzzySearchKeyword
  );
  const fuzzySearchOutput = useSelector((state) => state.ui.fuzzySearchOutput);

  // Save sidebar width and heigth for padding map
  const mobileSidebarRef = useRef();
  const broswerSidebarRef = useRef();

  useEffect(() => {
    if (isBrowser) {
      const width = broswerSidebarRef.current.clientWidth;
      const height = broswerSidebarRef.current.clientHeight;
      dispatch(uiActions.setSidebarWidth(width));
      dispatch(uiActions.setSidebarHeight(height));
    }

    if (isMobile) {
      const width = mobileSidebarRef.current.clientWidth;
      const height = mobileSidebarRef.current.clientHeight;
      dispatch(uiActions.setSidebarWidth(width));
      dispatch(uiActions.setSidebarHeight(height));
    }
  });

  const onClickSearchListHandler = (feature) => {
    dispatch(mapActions.setClickedFeature(feature));
    dispatch(uiActions.setToggleSidebarIsOpen());
  };

  return (
    <Fragment>
      <Grid sx={{ flexGrow: 1 }} container>
        {/* Desktop */}
        <Grid item sx={{ display: { xs: "none", md: "block" } }}>
          <Box
            ref={broswerSidebarRef}
            id="left"
            className={`sidebar flex-center left ${isCollasped}`}
          >
            <Box
              sx={{ paddingTop: "150px" }}
              className="sidebar-content rounded-rect flex-center"
            >
              {clickedFeature !== null && (
                <MediaCard feature={clickedFeature} />
              )}

              {clickedFeature === null &&
                fuzzySearchOutput.length !== 0 &&
                fuzzySearchKeyword !== null && (
                  <Box
                    sx={{
                      p: 2,
                      height: "90%",
                      overflow: "auto",
                      paddingBottom: "100px",
                    }}
                  >
                    {fuzzySearchOutput.map((o, index) => {
                      return (
                        <Fragment key={index}>
                          <SearchList
                            item={o.item}
                            keyword={fuzzySearchKeyword}
                            onClick={() => {
                              onClickSearchListHandler(o.item);
                            }}
                          />
                          <Divider sx={{ margin: "10px 0px 10px 0px" }} />
                        </Fragment>
                      );
                    })}
                  </Box>
                )}
            </Box>
          </Box>
        </Grid>
        {/* Mobile */}
        <Grid item sx={{ display: { xs: "block", md: "none" } }}>
          <Box
            ref={mobileSidebarRef}
            id="bottom"
            className={`sidebar_bottom flex-center bottom ${isCollasped}`}
          >
            <Box className="sidebar-content rounded-rect flex-center">
              {clickedFeature !== null && (
                <MediaCard feature={clickedFeature} />
              )}

              {clickedFeature === null &&
                fuzzySearchOutput.length !== 0 &&
                fuzzySearchKeyword !== null && (
                  <Box
                    sx={{
                      p: 2,
                      height: "100%",
                      overflow: "auto"
                    }}
                  >
                    {fuzzySearchOutput.map((o, index) => {
                      return (
                        <Fragment key={index}>
                          <SearchList
                            item={o.item}
                            keyword={fuzzySearchKeyword}
                            onClick={() => {
                              onClickSearchListHandler(o.item);
                            }}
                          />
                          <Divider sx={{ margin: "10px 0px 10px 0px" }} />
                        </Fragment>
                      );
                    })}
                  </Box>
                )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
};
export default ToggleSidebar;
