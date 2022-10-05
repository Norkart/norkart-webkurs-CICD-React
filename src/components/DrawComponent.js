import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const DrawComponent = (props) => {
  useEffect(() => {
    if (!props.MapConnection) return;
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        polygon: true,
        trash: true,
      },
    });
    props.MapConnection.addControl(draw);
  }, [props.MapConnection]);

  // Se flere muligheter med Draw Modulen til MapBox: https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md
  // Om vi har tilgang til kartet, render component. Ellers returner et tomt HTML objekt.
  return <>{props.MapConnection ? <div>DRAW ER PÅ</div> : <></>}</>;
};

export default DrawComponent;
