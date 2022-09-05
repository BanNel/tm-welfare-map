import { Fragment } from "react";
import { Source, Layer } from "react-map-gl";

const CompanySource = () => {
  const companys = {
    type: "FeatureCollection",
    features: [
      {
        id: "1",
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [121.54838821352193, 25.02312941733473],
        },
        properties: {
          name: "趨勢科技",
          "name:en": "Trend Micro Inc.",
          class: "公司",
          address: "106台北市大安區敦化南路二段198號",
          description:
            "趨勢科技為網路資安全球領導廠商，致力建立一個安全的資訊交換世界。憑藉著數十年的資安專業、全球威脅研究以及持續不斷的創新，我們跨雲端、網路、裝置及端點的網路資安平台隨時守護著全球 50 多萬家企業機構及 2.5 億以上的一般使用者。",
        },
      },
    ],
  };

  const layerStyle = {
    id: "company",
    type: "symbol",
    layout: {
      "text-anchor": "top",
      "text-field": "{name}\n{name:en}",
      "text-font": ["Noto Sans Regular"],
      "text-offset": [0, 0.6],
      "text-padding": 2,
      "text-size": 14,
      "icon-image": "trend_micro",
    },
    paint: {
      "text-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "rgba(3, 117, 214, 1)",
        "#1544AF",
      ],
      "text-halo-blur": 0.5,
      "text-halo-color": "#ffffff",
      "text-halo-width": 1,
    },
  };

  return (
    <Fragment>
      <Source id="company" type="geojson" data={companys}>
        <Layer {...layerStyle} />
      </Source>
    </Fragment>
  );
};

export default CompanySource;
