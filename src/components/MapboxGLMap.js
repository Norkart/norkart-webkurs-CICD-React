import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; // Load worker code separately with worker-loader
import { AdresseBoks } from "./AdresseBoks";
mapboxgl.workerClass = MapboxWorker; // Wire up loaded worker to be used instead of the default

const styles = {
  width: "100%",
  height: "calc(100vh - 80px)",
  position: "absolute",
};

const MapboxGLMap = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [10.408773, 63.422091],
        zoom: 10,
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) {
      initializeMap({ setMap, mapContainer });
    }
  }, [map]);

  return (
    <>
      <AdresseBoks></AdresseBoks>
      <div ref={(el) => (mapContainer.current = el)} style={styles} />;
    </>
  );
};

export default MapboxGLMap;
