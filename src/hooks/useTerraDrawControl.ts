import { useEffect, useRef } from 'react';
import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw';
import '@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css';
import { useMap } from 'maplibre-react-components';

type TerraDrawMode =
  | 'point'
  | 'linestring'
  | 'polygon'
  | 'rectangle'
  | 'circle'
  | 'select'
  | 'delete-selection'
  | 'delete'
  | 'render'
  | 'freehand'
  | 'freehand-linestring'
  | 'angled-rectangle'
  | 'sensor'
  | 'sector'
  | 'download';

interface TerraDrawOptions {
  modes?: TerraDrawMode[];
  open?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const useTerraDrawControl = (
  options: TerraDrawOptions = {}
): MaplibreTerradrawControl | null => {
  const map = useMap();
  const drawControlRef = useRef<MaplibreTerradrawControl | null>(null);

  const {
    modes = options.modes as TerraDrawMode[],
    open = true,
    position = 'top-left',
  } = options;

  useEffect(() => {
    if (!map || drawControlRef.current) return;

    try {
      const draw = new MaplibreTerradrawControl({
        modes,
        open,
      });
      map.addControl(draw, position);
      drawControlRef.current = draw;
    } catch (error) {
      console.error('Failed to initialize Terra Draw:', error);
    }

    return () => {
      if (drawControlRef.current && map) {
        try {
          map.removeControl(drawControlRef.current);
          drawControlRef.current = null;
        } catch (error) {
          console.warn('Error removing Terra Draw control:', error);
        }
      }
    };
  }, [map, modes, open, position]);

  return drawControlRef.current;
};
