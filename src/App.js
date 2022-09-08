import "./App.css";
import { Fragment, useEffect } from "react";
import MapView from "./components/Map/MapView";
import ToggleSidebar from "./components/UI/Sidebar/ToggleSidebar";
import SearchBar from "./components/UI/Searchbar/SearchBar";
import { fetchCompanyGeojson, fetchPoiGeojson } from "./store/map-actions";
import { useDispatch } from "react-redux";
import ReactGA from 'react-ga';

const TRACKING_ID = "G-DRY30JQH7K"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);
ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch poi geojson from static file
    dispatch(fetchPoiGeojson());
    dispatch(fetchCompanyGeojson());
  }, [dispatch]);

  return (
    <Fragment>
      <ToggleSidebar />
      <SearchBar />
      <MapView />
    </Fragment>
  );
}

export default App;
