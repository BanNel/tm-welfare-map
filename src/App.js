import "./App.css";
import { Fragment, useEffect } from "react";
import MapView from "./components/Map/MapView";
import ToggleSidebar from "./components/UI/Sidebar/ToggleSidebar";
import SearchBar from "./components/UI/Searchbar/SearchBar";

function App() {
  return (
    <Fragment>
      <ToggleSidebar />
      <SearchBar />
      <MapView />
    </Fragment>
  );
}

export default App;
