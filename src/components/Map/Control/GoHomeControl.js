import { useControl } from "react-map-gl";

class GoHomeControl {
  constructor(props) {
    this._className = props.className;
    this._title = props.title;
    this._lnglat = props.lnglat;
    this._zoom = props.zoom;
  }

  onAdd(map) {
    this._map = map;

    this._btn = document.createElement("button");
    this._btn.className = `maplibregl-ctrl-icon mapboxgl-ctrl-icon ${this._className}`;
    this._btn.type = "button";
    this._btn.title = this._title;
    this._btn.onclick = () => {
      this._map.flyTo({
        center: this._lnglat,
        zoom: this._zoom,
        bearing: 0,
        pitch: 0,
        speed: 1.2,
        curve: 1,
        easing(t) {
          return t;
        },
      });
    };

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

const GoHomeContorl = (props) => {
  useControl(() => new GoHomeControl(props), {
    position: props.position,
  });
  return null;
};

export default GoHomeContorl;
