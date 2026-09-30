import {
  LngLat,
  type MapLayerMouseEvent,
  type RequestTransformFunction,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  RLayer,
  RMap,
  RPopup,
  RSource,
  useMap,
} from 'maplibre-react-components';
import { Card, CardContent, Typography } from '@mui/material';
import { getHoydeFromPunkt } from '../api/getHoydeFromPunkt';
import { useEffect, useState } from 'react';
import { Overlay } from './Overlay';
import DrawComponent from './DrawComponent';
import { SearchBar, type Address } from './SearchBar';
import { getBygningAtPunkt } from '../api/getBygningAtPunkt';
import type { GeoJSON } from 'geojson';

const TRONDHEIM_COORDS: [number, number] = [10.40565401, 63.4156575];

const KVP_BASE_URL = 'https://kvp.maps.norkart.no/mvt/';

type NorkartBasemapVariant =
  | 'standard'
  | 'standard-without-text'
  | 'greyscale'
  | 'greyscale-without-text'
  | 'darkmode'
  | 'transparent'
  | 'hybrid'
  | 'ortofoto';
const NORKART_BASEMAP_VARIANT: NorkartBasemapVariant = 'standard';

const NORKART_BASEMAP_STYLE = `${KVP_BASE_URL}norkart-basemap/${NORKART_BASEMAP_VARIANT}/style.json`;

const polygonStyle = {
  'fill-color': 'rgba(255, 0, 106, 0.45)',
  'fill-opacity': 0.7,
};

const lineStyle = {
  'line-color': 'rgb(255, 0, 242)',
  'line-width': 3,
};

type Building = {
  Bygningsnummer?: number;
  FkbData?: {
    BygningsOmriss?: string;
    Medium?: string;
  };
  MatrikkelData?: {
    Bygningstype?: string;
    Bygningstatus?: string;
    Naringsgruppe?: string;
  };
};

export const MapLibreMap = () => {
  const [pointHoyde, setPointHoydeAtPunkt] = useState<number | undefined>(
    undefined
  );
  const [clickPoint, setClickPoint] = useState<LngLat | undefined>(undefined);

  const [address, setAddress] = useState<Address | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  const [bygningsOmriss, setBygningsOmriss] = useState<GeoJSON | undefined>(
    undefined
  );

  useEffect(() => {
    console.log(pointHoyde, clickPoint);
  }, [clickPoint, pointHoyde]);

  useEffect(() => {
    const fetchBuildingOutline = async () => {
      if (!address) {
        setBygningsOmriss(undefined);
        return;
      }

      const bygningResponse = await getBygningAtPunkt(
        address.PayLoad.Posisjon.X,
        address.PayLoad.Posisjon.Y
      );

      if (bygningResponse?.FkbData?.BygningsOmriss) {
        const geoJsonObject = JSON.parse(
          bygningResponse.FkbData.BygningsOmriss
        );
        setBygningsOmriss(geoJsonObject);
        setSelectedBuilding(bygningResponse as Building);
        return;
      }

      setBygningsOmriss(undefined);
      setSelectedBuilding(null);
    };

    void fetchBuildingOutline();
  }, [address]);

  const onMapClick = async (e: MapLayerMouseEvent) => {
    const hoyder = await getHoydeFromPunkt(e.lngLat.lng, e.lngLat.lat);
    const bygningResponse = await getBygningAtPunkt(e.lngLat.lng, e.lngLat.lat);
    if (bygningResponse?.FkbData?.BygningsOmriss) {
      const geoJsonObject = JSON.parse(bygningResponse.FkbData.BygningsOmriss);
      setBygningsOmriss(geoJsonObject);
      setSelectedBuilding(bygningResponse as Building);
    } else {
      setBygningsOmriss(undefined);
      setSelectedBuilding(null);
    }

    setPointHoydeAtPunkt(hoyder[0].Z);
    setClickPoint(new LngLat(e.lngLat.lng, e.lngLat.lat));
  };

  return (
    <RMap
      minZoom={6}
      initialCenter={TRONDHEIM_COORDS}
      initialZoom={12}
      mapStyle={NORKART_BASEMAP_STYLE}
      initialTransformRequest={transformRequest}
      style={{
        height: `calc(100dvh - var(--header-height))`,
      }}
      onClick={onMapClick}
    >
      <Overlay>
        <SearchBar setAddress={setAddress} />
      </Overlay>
      {selectedBuilding && (
        <Overlay
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '20px',
            zIndex: 2,
            maxWidth: '320px',
            boxShadow: 'none',
          }}
        >
          <Card sx={{ width: '100%', boxShadow: 'none' , color: 'hsl(320, 100%, 50%)'}}>
            <Typography variant="h6">Bygning</Typography>
            <Typography variant="body2">
              Bygningsnummer: {selectedBuilding.Bygningsnummer ?? '-'}
            </Typography>
            <Typography variant="body2">
              Type: {selectedBuilding.MatrikkelData?.Bygningstype ?? '-'}
            </Typography>
            <Typography variant="body2">
              Status: {selectedBuilding.MatrikkelData?.Bygningstatus ?? '-'}
            </Typography>
            <Typography variant="body2">
              Næringsgruppe:{' '}
              {selectedBuilding.MatrikkelData?.Naringsgruppe ?? '-'}
            </Typography>
          </Card>
        </Overlay>
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
          <RLayer
            source="bygning"
            id="bygning-line"
            type="line"
            paint={lineStyle}
          />
        </>
      )}
      {address ? (
        <MapFlyTo
          lng={address.PayLoad.Posisjon.X}
          lat={address.PayLoad.Posisjon.Y}
        />
      ) : null}
      {clickPoint && (
        <RPopup longitude={clickPoint.lng} latitude={clickPoint.lat}>
          <div>
            <strong>Map point</strong>
            <div>
              Elevation:{' '}
              {pointHoyde !== undefined ? `${pointHoyde} moh.` : 'Loading...'}
            </div>
          </div>
        </RPopup>
      )}
      <DrawComponent />
    </RMap>
  );
};

function MapFlyTo({ lng, lat }: { lng: number; lat: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo({ center: [lng, lat], zoom: 17, speed: 10 });
  }, [lng, lat, map]);

  return null;
}

const transformRequest: RequestTransformFunction = (url) => {
  if (!url.startsWith(KVP_BASE_URL)) {
    return { url };
  }

  const apiKey = import.meta.env.VITE_API_KEY;
  const separator = url.includes('?') ? '&' : '?';
  return { url: `${url}${separator}api_key=${encodeURIComponent(apiKey)}` };
};
