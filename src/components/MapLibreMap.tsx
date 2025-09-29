import type { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { RMap } from "maplibre-react-components";
import "./MapLibreMap.css";
import { getHoydeFromPunkt } from "../api/getHoydeFromPunkt";
import {
  useEffect,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from "react";

const TRONDHEIM_COORDS: [number, number] = [10.40565401, 63.4156575];

function Overlay({
  children,
  style,
}: PropsWithChildren & { style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "20px",
        width: "fit-content",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const MapLibreMap = () => {
  const [hoyde, setHoydeAtPunkt] = useState<undefined | number>(undefined);

  useEffect(() => {
    console.log(hoyde);
  }, [hoyde]);

  const onMapClick = async (e: MapLayerMouseEvent) => {
    const hoyder = await getHoydeFromPunkt(e.lngLat.lng, e.lngLat.lat);
    setHoydeAtPunkt(hoyder[0].Z);
  };

  return (
    <RMap
      minZoom={6}
      initialCenter={TRONDHEIM_COORDS}
      initialZoom={12}
      mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
      style={{
        height: `calc(100dvh - var(--header-height))`,
      }}
      onClick={onMapClick}
    >
      <Overlay>
        <h2>Dette er et overlay</h2>
        <p>Legg til funksjonalitet knyttet til kartet.</p>
      </Overlay>
      <Overlay>
        <h2>Dette er et overlay</h2>
        <p>Legg til funksjonalitet knyttet til kartet.</p>
      </Overlay>
      <Overlay style={{ position: "absolute", bottom: 0 }}>
        <h2>Dette er et overlay</h2>
        <p>Legg til funksjonalitet knyttet til kartet.</p>
      </Overlay>
    </RMap>
  );
};
