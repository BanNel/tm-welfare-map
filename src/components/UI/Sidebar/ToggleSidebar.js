import { Fragment, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/ui-slice";
import { mapActions } from "../../../store/map-slice";

import MediaCard from "./MediaCard";
import SearchList from "../SearchList/SearchList";
import { isBrowser, isMobile } from "react-device-detect";

import { Box, Grid, Divider } from "@mui/material";
import { styled } from "@mui/system";

const CustomBox = styled(Box)({
  // sidebar-content
  position: "absolute",
  width: "100%",
  height: "100%",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "32px",
  color: "gray",

  // flex-center
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  // rounded-rect
  background: "white",
  borderRadius: "0px 10px 10px 0px",
  boxShadow: "2px 0px 50px -25px black",
});

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
  const windowSize = useSelector((state) => state.ui.windowSize);

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
            sx={{
              transition: "transform 1s",
              zIndex: "1",
              width: "25vw",
              height: "100%",
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              left: 0,
              transform: isCollasped ? `translateX(-25vw)` : "",
            }}
          >
            <CustomBox sx={{ paddingTop: "150px" }}>
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
            </CustomBox>
          </Box>
        </Grid>
        {/* Mobile */}
        <Grid item sx={{ display: { xs: "block", md: "none" } }}>
          <Box
            ref={mobileSidebarRef}
            id="bottom"
            sx={{
              overflow: "auto",
              transition: "transform 1s",
              zIndex: 3,
              width: windowSize.width + "px",
              height: windowSize.height / 2 + "px",
              borderRadius: "15px 15px 0px 0px",
              boxShadow: "0px -1px 15px 0px #9e9e9e81",
              top: windowSize.height / 2 + "px",
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: isCollasped
                ? `translateY(${windowSize.height / 2}px)`
                : "",
            }}
          >
            <CustomBox>
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
                      overflow: "auto",
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
            </CustomBox>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
};
export default ToggleSidebar;
