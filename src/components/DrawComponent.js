import React, { useEffect, useState } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";

const drawStyle = {
  position: "absolute",
  background: "white",
  padding: 20,
  zIndex: "2",
  bottom: "0vh",
};

const DrawComponent = (props) => {
  const map = props.mapConnection;
  const [area, setarea] = useState(0);

  function updateArea(e, draw) {
    const data = draw.getAll();
    
    if (data.features.length > 0) {
      const area = turf.area(data);
      const rounded_area = Math.round(area * 100) / 100;  // Restrict the area to 2 decimal points.
      setarea(rounded_area)
      
    } else {
      if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
    }
  }

  useEffect(() => {
    if (!map) return;
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.addControl(draw);

    map.on("draw.create", (e) => updateArea(e, draw));
    map.on("draw.delete", (e) => updateArea(e, draw));
    map.on("draw.update", (e) => updateArea(e, draw));

  }, [map]);

  // Se flere muligheter med Draw Modulen til MapBox: https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md
  // Om vi har tilgang til kartet, render component. Ellers returner et tomt HTML objekt.
  return <>{map ? <div style={drawStyle}>Area: {area} m^2</div> : <></>}</>;
};

export default DrawComponent;
