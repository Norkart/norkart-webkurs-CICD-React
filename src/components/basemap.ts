export type BasemapVariant =
  | 'topo'
  | 'topograatone'
  | 'toporaster'
  | 'sjokartraster'
  | 'orto'
  | 'satellite';

export const BASEMAP_OPTIONS: Array<{
  value: BasemapVariant;
  label: string;
  description?: string;
  recommended?: boolean;
}> = [
  { value: 'topo', label: 'Topografisk' },
  { value: 'topograatone', label: 'Gråtone' },
  { value: 'toporaster', label: 'Turkart' },
  { value: 'sjokartraster', label: 'Sjøkart' },
  { value: 'orto', label: 'Ortofoto' },
  {
    value: 'satellite',
    label: '🛰️ Satellitt',
    description: 'Satellittbilder uten høydeledetråder',
    recommended: true,
  },
];

export const KARTVERKET_TILE_TEMPLATE =
  'https://cache.kartverket.no/v1/wmts/1.0.0/{variant}/default/webmercator/{z}/{y}/{x}.png';

export const NORGEIBILDER_TILE_TEMPLATE =
  'https://tilecache.norgeibilder.no/wmts/webmercator/nibcache/{z}/{x}/{y}.jpeg?token={token}';

export const SATELLITE_TILE_TEMPLATE =
  'https://e.tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg';

export const SATELLITE_ATTRIBUTION =
  'Sentinel-2 cloudless by EOX IT Services GmbH, contains modified Copernicus Sentinel data';
