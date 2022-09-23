import "./App.css";
import { Fragment, useEffect } from "react";
import MapView from "./components/Map/MapView";
import ToggleSidebar from "./components/UI/Sidebar/ToggleSidebar";
import SearchBar from "./components/UI/Searchbar/SearchBar";
import InformationDrawer from "./components/UI/Drawer/InformationDrawer";
import { fetchCompanyGeojson, fetchPoiGeojson } from "./store/map-actions";
import { useDispatch } from "react-redux";
import ReactGA from "react-ga4";
import TaxIdModal from "./components/UI/Modal/TaxIdModal";
import useResize from "./hooks/use-resize";
import { uiActions } from "./store/ui-slice";

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
      <InformationDrawer />
      <TaxIdModal />
      <ToggleSidebar />
      <SearchBar />
      {windowIsReady && <MapView />}
    </Fragment>
  );
}

export default App;
