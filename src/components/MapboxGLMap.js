import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const styles = {
  width: "100%",
  height: "calc(100vh - 80px)",
  position: "absolute",
};

const menuStyle = {
  position: "absolute",
  background: "white",
  padding: 10,
  zIndex: "1",
  display: "flex",
};

const backgroundLayers = [
  { id: "streets-v11", name: "Streets" },
  { id: "light-v10", name: "Light" },
  { id: "dark-v10", name: "Dark" },
  { id: "satellite-v9", name: "Satellite" },
];

const MapboxGLMap = () => {
  const [map, setMap] = useState(null);
  const [backgroundLayerID, setbackgroundLayerID] = useState("streets-v11");
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${backgroundLayerID}`,
        center: [10.408773, 63.422091],
        zoom: 10,
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
    if (map) map.setStyle("mapbox://styles/mapbox/" + backgroundLayerID);
  }, [backgroundLayerID, map]);

  return (
    <div>
      <div style={menuStyle}>
        {backgroundLayers.map((backgroundLayer) => (
          <div key={backgroundLayer.id}>
            <input
              id={backgroundLayer.id}
              type="radio"
              name="rtoggle"
              value={backgroundLayer.id}
              onClick={() => setbackgroundLayerID(backgroundLayer.id)}
              defaultChecked={backgroundLayer.id === backgroundLayerID}
            />
            <label>{backgroundLayer.name}</label>
          </div>
        ))}
      </div>
      <div ref={(el) => (mapContainer.current = el)} style={styles} />
    </div>
  );
};

export default MapboxGLMap;
