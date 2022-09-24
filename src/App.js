import "./App.css";
import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCompanyGeojson, fetchPoiGeojson } from "./store/map-actions";
import { uiActions } from "./store/ui-slice";
import useResize from "./hooks/use-resize";

import MapView from "./components/Map/MapView";
import TaxIdModal from "./components/UI/Modal/TaxIdModal";
import SearchBar from "./components/UI/Searchbar/SearchBar";
import ToggleSidebar from "./components/UI/Sidebar/ToggleSidebar";
import InformationDrawer from "./components/UI/Drawer/InformationDrawer";

import ReactGA from "react-ga4";

const TRACKING_ID = "G-DRY30JQH7K"; // OUR_TRACKING_ID

function App() {
  const dispatch = useDispatch();

  const windowSize = useResize();

  useEffect(() => {
    if (windowSize == null) return;
    dispatch(uiActions.setWindowSize(windowSize));
  }, [dispatch, windowSize]);

  useEffect(() => {
    // Fetch poi geojson from static file
    dispatch(fetchPoiGeojson());
    dispatch(fetchCompanyGeojson());
  }, [dispatch]);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const windowIsReady = windowSize.width !== null && windowSize.height !== null;

  return (
    <Fragment>
      {windowIsReady && (
        <Fragment>
          <InformationDrawer />
          <TaxIdModal />
          <ToggleSidebar />
          <SearchBar />
          <MapView />
        </Fragment>
      )}
    </Fragment>
  );
}

export default App;
