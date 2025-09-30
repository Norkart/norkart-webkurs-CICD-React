import type { MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RMap, useMap } from 'maplibre-react-components';
import { getHoydeFromPunkt } from '../api/getHoydeFromPunkt';
import { useEffect, useState } from 'react';
import { Overlay } from './Overlay';
import DrawComponent from './DrawComponent';

const TRONDHEIM_COORDS: [number, number] = [10.40565401, 63.4156575];

export const MapLibreMap = () => {
  const [pointHoyde, setPointHoydeAtPunkt] = useState<undefined | number>(
    undefined
  );
  const [pointLatitude, setPointLatitude] = useState<undefined | number>(
    undefined
  );
  const [pointLongitude, setPointLongitude] = useState<undefined | number>(
    undefined
  );

  useEffect(() => {
    console.log(pointHoyde);
  }, [pointHoyde]);

  const onMapClick = async (e: MapLayerMouseEvent) => {
    const hoyder = await getHoydeFromPunkt(e.lngLat.lng, e.lngLat.lat);
    setPointHoydeAtPunkt(hoyder[0].Z);
    setPointLatitude(hoyder[0].Y);
    setPointLongitude(hoyder[0].X);
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
      <DrawComponent />
    </RMap>
  );
};

const MapFlyTo = ({
  lat,
  lng,
}: {
  lat: number | undefined;
  lng: number | undefined;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!lat || !lng) return;
    map.flyTo({ center: [lng, lat], zoom: 20, speed: 10 });
  }, [lat, lng, map]);

  return null;
};
