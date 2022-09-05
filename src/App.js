import "./App.css";
import { Fragment } from "react";
import MapView from "./components/Map/MapView";
import ToggleSidebar from "./components/UI/Sidebar/ToggleSidebar";

function App() {
  return (
    <Fragment>
      <ToggleSidebar />
      <MapView />
    </Fragment>
  );
}

export default App;
