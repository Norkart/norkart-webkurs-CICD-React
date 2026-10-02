export type BasemapVariant = 'topo' | 'topograatone' | 'toporaster' | 'sjokartraster';

export const BASEMAP_OPTIONS: Array<{ value: BasemapVariant; label: string }> = [
  { value: 'topo', label: 'Topografisk' },
  { value: 'topograatone', label: 'Gråtone' },
  { value: 'toporaster', label: 'Turkart' },
  { value: 'sjokartraster', label: 'Sjøkart' },
];

export const KARTVERKET_TILE_TEMPLATE =
  'https://cache.kartverket.no/v1/wmts/1.0.0/{variant}/default/webmercator/{z}/{y}/{x}.png';
