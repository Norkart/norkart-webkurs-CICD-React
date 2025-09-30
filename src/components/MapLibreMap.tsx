import { LngLat, type MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  RLayer,
  RMap,
  RPopup,
  RSource,
  useMap,
} from 'maplibre-react-components';
import { getHoydeFromPunkt } from '../api/getHoydeFromPunkt';
import { useEffect, useState } from 'react';
import { Overlay } from './Overlay';
import DrawComponent from './DrawComponent';
import { SearchBar, type Address } from './SearchBar';
import { getBygningAtPunkt } from '../api/getBygningAtPunkt';
import type { GeoJSON } from 'geojson';

const TRONDHEIM_COORDS: [number, number] = [10.40565401, 63.4156575];

export const MapLibreMap = () => {
  const [pointHoyde, setPointHoydeAtPunkt] = useState<number | undefined>(
    undefined
  );
  const [address, setAddress] = useState<Address | null>(null); // <--- Legg til dette!
  const [clickPoint, setClickPoint] = useState<LngLat | undefined>(undefined);
  const [bygningsOmriss, setBygningsOmriss] = useState<GeoJSON | undefined>(
    undefined
  );

  // useEffect(() => {
  //   console.log(pointHoyde, clickPoint, bygningsOmriss);
  // }, [clickPoint, pointHoyde, bygningsOmriss]);

  const onMapClick = async (e: MapLayerMouseEvent) => {
    // Oppgave 4 - Vis bygningsomriss
    const bygningResponse = await getBygningAtPunkt(e.lngLat.lng, e.lngLat.lat);
    console.log(bygningResponse);
    if (bygningResponse?.FkbData?.BygningsOmriss) {
      const geoJsonObject = JSON.parse(bygningResponse.FkbData.BygningsOmriss);
      // console.log(geoJsonObject);
      setBygningsOmriss(geoJsonObject);
    } else {
      setBygningsOmriss(undefined);
    }

    // Oppgave 2
    const hoyder = await getHoydeFromPunkt(e.lngLat.lng, e.lngLat.lat);
    setPointHoydeAtPunkt(hoyder[0].Z);
    setClickPoint(new LngLat(e.lngLat.lng, e.lngLat.lat));
  };

  const polygonStyle = {
    'fill-outline-color': 'rgba(0,0,0,0.1)',
    'fill-color': 'rgba(18, 94, 45, 0.41)',
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
      {clickPoint && (
        <RPopup
          longitude={clickPoint.lng}
          latitude={clickPoint.lat}
          onMapClick={() => setClickPoint(undefined)}
        >
          Hello!
          <button
            className="maplibregl-popup-close-button"
            onClick={() => setClickPoint(undefined)}
          >
            ×
          </button>
        </RPopup>
      )}
      <Overlay>
        <SearchBar setAddress={setAddress} />
        <h2>Klikk i kartet for flere stats 🤓</h2>
        <p>
          {clickPoint && `Koordinater:  ${clickPoint.lng}, ${clickPoint.lat}`}
        </p>
        <p>{clickPoint && `Høyde: ${pointHoyde} m`}</p>
      </Overlay>
      <DrawComponent />
      {address && (
        <MapFlyTo
          lngLat={
            new LngLat(address.PayLoad.Posisjon.X, address.PayLoad.Posisjon.Y)
          }
        />
      )}
      {bygningsOmriss && (
        <>
          <RSource id="bygning" type="geojson" data={bygningsOmriss} />
          <RLayer
            source="bygning"
            id="bygning-fill"
            type="fill"
            paint={polygonStyle}
          />
        </>
      )}
    </RMap>
  );
};

function MapFlyTo({ lngLat }: { lngLat: LngLat }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo({ center: [lngLat.lng, lngLat.lat], zoom: 20, speed: 10 });
  }, [lngLat, map]);

  return null;
}
