import {
  type MapLayerMouseEvent,
  type StyleSpecification,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  RLayer,
  RMap,
  RMarker,
  RNavigationControl,
  RSource,
  useMap,
} from 'maplibre-react-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Overlay } from './Overlay';
import DrawComponent from './DrawComponent';
import { GamePanel, type Attempt, type HighscoreEntry } from './GamePanel';
import { ResultDialog } from './ResultDialog';
import { HighscoreDialog } from './HighscoreDialog';
import { MiniGameHud } from './MiniGameHud';
import { IntroDialog } from './IntroDialog';
import { getElevationFromMapterhorn } from '../api/getElevationFromMapterhorn';
import {
  type BasemapVariant,
  KARTVERKET_TILE_TEMPLATE,
} from './basemap';

const NORWAY_CENTER: [number, number] = [10.5, 64.5];
const TARGET_HEIGHT_MIN = 0;
const TARGET_HEIGHT_MAX = 2000;
const MIN_GUESS_DISTANCE_METERS = 2000;
const HIGHSCORE_STORAGE_KEY = 'hoydetreff-highscores';
const TERRAIN_SOURCE_ID = 'terrain-dem';
const TERRAIN_TILE_URL = 'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp';
const TERRAIN_ATTRIBUTION = 'Terrain data: Mapterhorn and data providers';
const TERRAIN_PITCH = 55;
const START_VIEW_ZOOM = 4.5;
type GuessPoint = { lng: number; lat: number };
const createKartverketStyle = (variant: BasemapVariant): StyleSpecification => {
  const tileUrl = KARTVERKET_TILE_TEMPLATE.replace('{variant}', variant);
  return {
  version: 8,
  sources: {
    kartverket: {
      type: 'raster',
      tiles: [tileUrl],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 18,
      attribution: '© Kartverket',
    },
    [TERRAIN_SOURCE_ID]: {
      type: 'raster-dem',
      tiles: [TERRAIN_TILE_URL],
      encoding: 'terrarium',
      tileSize: 512,
      attribution: TERRAIN_ATTRIBUTION,
    },
  },
  terrain: { source: TERRAIN_SOURCE_ID, exaggeration: 1 },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#e8edf0' },
    },
    {
      id: 'kartverket-topo',
      type: 'raster',
      source: 'kartverket',
      minzoom: 0,
      maxzoom: 18,
    },
  ],
  };
};

export const MapLibreMap = () => {
  const [targetHeight, setTargetHeight] = useState(randomTargetHeight);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [guessPoints, setGuessPoints] = useState<GuessPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [highscores, setHighscores] = useState<HighscoreEntry[]>(loadHighscores);
  const [highscoreOpen, setHighscoreOpen] = useState(false);
  const [highlightedHighscoreDate, setHighlightedHighscoreDate] = useState<string>();
  const [resultSaved, setResultSaved] = useState(false);
  const [terrainEnabled, setTerrainEnabled] = useState(false);
  const [terrainError, setTerrainError] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(true);
  const [viewResetKey, setViewResetKey] = useState(0);
  const [introOpen, setIntroOpen] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [basemapVariant, setBasemapVariant] = useState<BasemapVariant>('topo');
  const initialBasemapStyle = useMemo(
    () => createKartverketStyle('topo'),
    []
  );
  const gameId = useRef(0);
  const requestInFlight = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      gameId.current += 1;
    };
  }, []);

  const onMapClick = async (e: MapLayerMouseEvent) => {
    if (requestInFlight.current || attempts.length >= 3) {
      return;
    }

    const point = { lng: e.lngLat.lng, lat: e.lngLat.lat };
    const isTooCloseToPreviousGuess = guessPoints.some(
      (guessPoint) =>
        distanceInMeters(guessPoint, point) < MIN_GUESS_DISTANCE_METERS
    );
    if (isTooCloseToPreviousGuess) {
      setError('Velg et punkt minst 2 km fra alle tidligere gjett.');
      return;
    }

    requestInFlight.current = true;
    setIsLoading(true);
    setError(null);
    const currentGameId = gameId.current;

    try {
      const hoyde = await getElevationFromMapterhorn(point.lng, point.lat);

      if (currentGameId !== gameId.current) {
        return;
      }
      if (hoyde === null) {
        setError('Høydedataene er ikke ferdig lastet. Vent litt og prøv igjen.');
        return;
      }

      setAttempts((currentAttempts) =>
        currentAttempts.length < 3
          ? [...currentAttempts, { height: hoyde, deviation: Math.abs(hoyde - targetHeight) }]
          : currentAttempts
      );
      setGuessPoints((currentPoints) =>
        currentPoints.length < 3 ? [...currentPoints, point] : currentPoints
      );
      if (attempts.length === 2) {
        setResultOpen(true);
      }
    } catch {
      if (currentGameId === gameId.current) {
        setError('Høydeoppslaget feilet. Forsøket er ikke brukt.');
      }
    } finally {
      if (currentGameId === gameId.current) {
        requestInFlight.current = false;
        setIsLoading(false);
      }
    }
  };

  const startNewGame = () => {
    gameId.current += 1;
    requestInFlight.current = false;
    setTargetHeight(randomTargetHeight());
    setAttempts([]);
    setGuessPoints([]);
    setError(null);
    setIsLoading(false);
    setTerrainEnabled(false);
    setIntroOpen(true);
    setPanelVisible(true);
    setViewResetKey((key) => key + 1);
    setResultOpen(false);
    setResultSaved(false);
    setHighlightedHighscoreDate(undefined);
  };

  const bestAttemptIndex = getBestAttemptIndex(attempts, targetHeight);
  const bestAttempt = attempts[bestAttemptIndex]?.height;
  const thirdAttempt = attempts[2]?.height;
  const deviation =
    bestAttempt === undefined
      ? undefined
      : roundToOneDecimal(Math.abs(bestAttempt - targetHeight));
  const score =
    deviation === undefined ? undefined : Math.max(0, 1000 - deviation);
  const qualifies =
    score !== undefined &&
    deviation !== undefined &&
    qualifiesForHighscore(highscores, score, deviation);

  const saveHighscore = (name: string) => {
    if (
      resultSaved ||
      score === undefined ||
      deviation === undefined ||
      !qualifies
    ) {
      return;
    }

    const entry: HighscoreEntry = {
      name: name.trim().slice(0, 20) || 'Anonym',
      score,
      deviation,
      targetHeight,
      bestAttempt: bestAttemptIndex + 1,
      date: new Date().toISOString(),
    };
    const updatedHighscores = sortHighscores([...highscores, entry]).slice(0, 10);
    setHighscores(updatedHighscores);
    setResultSaved(true);
    setHighlightedHighscoreDate(entry.date);
    setResultOpen(false);
    setHighscoreOpen(true);
    try {
      localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(updatedHighscores));
    } catch (storageError) {
      console.error('Kunne ikke lagre topplisten lokalt:', storageError);
    }
  };

  const resetHighscores = () => {
    if (!window.confirm('Er du sikker på at du vil nullstille topplisten?')) {
      return;
    }
    setHighscores([]);
    try {
      localStorage.removeItem(HIGHSCORE_STORAGE_KEY);
    } catch (storageError) {
      console.error('Kunne ikke nullstille topplisten lokalt:', storageError);
    }
  };

  return (
    <RMap
      minZoom={3}
      initialCenter={NORWAY_CENTER}
      initialZoom={4.5}
      mapStyle={initialBasemapStyle}
      style={{
        height: `calc(100dvh - var(--header-height))`,
      }}
      onClick={onMapClick}
      onError={(event) => {
        console.error('Kartverket-kartflis feilet:', event.error);
        setMapError('Kartverket-kartet kunne ikke lastes.');
      }}
    >
      {guessPoints.map((point, index) => (
        <RSource
          key={`guess-radius-source-${index}`}
          id={`guess-radius-${index}`}
          type="geojson"
          data={createRadiusCircle(point, MIN_GUESS_DISTANCE_METERS)}
        />
      ))}
      {guessPoints.map((_, index) => (
        <RLayer
          key={`guess-radius-fill-${index}`}
          id={`guess-radius-fill-${index}`}
          type="fill"
          source={`guess-radius-${index}`}
          paint={{
            'fill-color': '#d32f2f',
            'fill-opacity': 0.18,
          }}
        />
      ))}
      {guessPoints.map((_, index) => (
        <RLayer
          key={`guess-radius-outline-${index}`}
          id={`guess-radius-outline-${index}`}
          type="line"
          source={`guess-radius-${index}`}
          paint={{
            'line-color': '#d32f2f',
            'line-width': 2,
            'line-opacity': 0.9,
          }}
        />
      ))}
      {guessPoints.map((point, index) => (
        <RMarker
          key={`${point.lng}-${point.lat}-${index}`}
          longitude={point.lng}
          latitude={point.lat}
          initialColor={
            index === bestAttemptIndex && attempts.length > 0
              ? '#16a34a'
              : '#64748b'
          }
        />
      ))}
      <Overlay style={{ backgroundColor: 'transparent', boxShadow: 'none', padding: 0 }}>
        <div key={panelVisible ? 'open' : 'minimized'} className="menu-state-transition">
        {panelVisible ? (
          <GamePanel
            targetHeight={targetHeight}
            attempts={attempts}
            isLoading={isLoading}
            error={mapError ?? error ?? terrainError}
            score={score}
            deviation={deviation}
            onNewGame={startNewGame}
            onOpenHighscores={() => setHighscoreOpen(true)}
            onOpenIntro={() => setIntroOpen(true)}
            terrainEnabled={terrainEnabled}
            onToggleTerrain={() => setTerrainEnabled((enabled) => !enabled)}
            onHidePanel={() => setPanelVisible(false)}
            bestAttemptIndex={bestAttemptIndex}
            basemapVariant={basemapVariant}
            onBasemapChange={setBasemapVariant}
          />
        ) : (
          <MiniGameHud
            targetHeight={targetHeight}
            attempts={attempts}
            bestAttemptIndex={bestAttemptIndex}
            terrainEnabled={terrainEnabled}
            onOpenPanel={() => setPanelVisible(true)}
            onToggleTerrain={() => setTerrainEnabled((enabled) => !enabled)}
            basemapVariant={basemapVariant}
            onBasemapChange={setBasemapVariant}
          />
        )}
        </div>
      </Overlay>
      {thirdAttempt !== undefined && deviation !== undefined && score !== undefined && (
        <ResultDialog
          open={resultOpen}
          score={score}
          deviation={deviation}
          targetHeight={targetHeight}
          bestAttempt={bestAttempt as number}
          bestAttemptNumber={bestAttemptIndex + 1}
          qualifies={qualifies}
          saved={resultSaved}
          onSave={saveHighscore}
          onNewGame={startNewGame}
        />
      )}
      <HighscoreDialog
        open={highscoreOpen}
        entries={highscores}
        highlightedEntryDate={highlightedHighscoreDate}
        onClose={() => setHighscoreOpen(false)}
        onReset={resetHighscores}
      />
      <IntroDialog open={introOpen} onClose={() => setIntroOpen(false)} />
      <RNavigationControl position="top-right" visualizePitch />
      <TerrainManager
        enabled={terrainEnabled}
        onError={setTerrainError}
      />
      <MapViewResetManager resetKey={viewResetKey} />
      <MapStyleCameraManager basemapVariant={basemapVariant} />
      <MapDetailManager />
      <DrawComponent />
    </RMap>
  );
};

function MapViewResetManager({ resetKey }: { resetKey: number }) {
  const map = useMap();
  const previousResetKey = useRef(resetKey);

  useEffect(() => {
    if (previousResetKey.current === resetKey) return;
    previousResetKey.current = resetKey;

    map.stop();
    map.jumpTo({
      center: NORWAY_CENTER,
      zoom: START_VIEW_ZOOM,
      pitch: 0,
      bearing: 0,
    });
  }, [map, resetKey]);

  return null;
}

function MapStyleCameraManager({ basemapVariant }: { basemapVariant: BasemapVariant }) {
  const map = useMap();
  const previousVariant = useRef(basemapVariant);
  const camera = useRef<{
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  } | null>(null);

  useEffect(() => {
    if (previousVariant.current === basemapVariant) return;
    previousVariant.current = basemapVariant;
    camera.current = {
      center: [map.getCenter().lng, map.getCenter().lat],
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing(),
    };

    if (map.getTerrain()) {
      map.setTerrain(null);
    }

    const restoreCamera = () => {
      if (!camera.current) return;
      map.jumpTo(camera.current);
      camera.current = null;
      map.off('style.load', restoreCamera);
    };

    map.on('style.load', restoreCamera);
    map.setStyle(createKartverketStyle(basemapVariant), { diff: false });
    return () => {
      map.off('style.load', restoreCamera);
    };
  }, [basemapVariant, map]);

  return null;
}

function TerrainManager({
  enabled,
  onError,
}: {
  enabled: boolean;
  onError: (message: string | null) => void;
}) {
  const map = useMap();
  const preservedCamera = useRef<{
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  } | null>(null);

  useEffect(() => {
    let disposed = false;
    let retryTimer: number | undefined;
    let terrainAppliedToStyle = false;
    const setTerrainForCurrentStyle = () => {
      if (disposed || !map.isStyleLoaded()) {
        return;
      }

      if (enabled && terrainAppliedToStyle) {
        return;
      }

      try {
        if (!map.getSource(TERRAIN_SOURCE_ID)) {
          map.addSource(TERRAIN_SOURCE_ID, {
            type: 'raster-dem',
            tiles: [TERRAIN_TILE_URL],
            encoding: 'terrarium',
            tileSize: 512,
            attribution: TERRAIN_ATTRIBUTION,
          });
        }

        map.setTerrain({
          source: TERRAIN_SOURCE_ID,
          exaggeration: enabled ? 1.5 : 1,
        });
        map.setMaxPitch(80);
        if (!enabled) {
          if (preservedCamera.current) {
            map.jumpTo({
              center: preservedCamera.current.center,
              zoom: preservedCamera.current.zoom,
              pitch: 0,
              bearing: preservedCamera.current.bearing,
            });
          } else {
            map.easeTo({ pitch: 0, duration: 500 });
          }
        } else if (preservedCamera.current) {
          map.jumpTo({
            center: preservedCamera.current.center,
            zoom: preservedCamera.current.zoom,
            pitch: preservedCamera.current.pitch,
            bearing: preservedCamera.current.bearing,
          });
        } else {
          map.easeTo({ pitch: TERRAIN_PITCH, duration: 800 });
        }
        onError(null);
        terrainAppliedToStyle = true;
      } catch (error) {
        console.error('Kunne ikke koble til Mapterhorn-terreng:', error);
        onError('3D-terreng kunne ikke lastes. Kartet fungerer fortsatt i 2D.');
      }
    };

    const scheduleTerrainBinding = () => {
      if (disposed) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        if (disposed) return;
        if (map.isStyleLoaded()) {
          setTerrainForCurrentStyle();
          return;
        }
        retryTimer = window.setTimeout(scheduleTerrainBinding, 100);
      });
    };

    const handleStyleLoad = () => {
      terrainAppliedToStyle = false;
      scheduleTerrainBinding();
    };
    const handleIdle = () => {
      if (!terrainAppliedToStyle) {
        scheduleTerrainBinding();
      }
    };
    const handleMapError = (event: { sourceId?: string; error?: Error }) => {
      if (enabled && event.sourceId === TERRAIN_SOURCE_ID) {
        console.error('Mapterhorn-terrengflis feilet:', event.error);
        onError('3D-terreng kunne ikke lastes. Kartet fungerer fortsatt i 2D.');
      }
    };

    let animationFrame = 0;
    map.on('style.load', handleStyleLoad);
    map.on('idle', handleIdle);
    map.on('error', handleMapError);
    if (map.isStyleLoaded() && !enabled) {
      terrainAppliedToStyle = false;
      scheduleTerrainBinding();
    } else if (map.isStyleLoaded()) {
      scheduleTerrainBinding();
    }

    return () => {
      disposed = true;
      preservedCamera.current = {
        center: [map.getCenter().lng, map.getCenter().lat],
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      };
      window.cancelAnimationFrame(animationFrame);
      if (retryTimer !== undefined) {
        window.clearTimeout(retryTimer);
      }
      map.off('style.load', handleStyleLoad);
      map.off('idle', handleIdle);
      map.off('error', handleMapError);
    };
  }, [enabled, map, onError]);

  return null;
}

function MapDetailManager() {
  // Height clues remain visible in Kartverket's baked raster tiles.
  return null;
}

function randomTargetHeight() {
  return (
    Math.floor(Math.random() * (TARGET_HEIGHT_MAX - TARGET_HEIGHT_MIN + 1)) +
    TARGET_HEIGHT_MIN
  );
}

function getBestAttemptIndex(attempts: Attempt[], targetHeight: number) {
  if (attempts.length === 0) return -1;
  return attempts.reduce((bestIndex, attempt, index) => {
    const bestDeviation = Math.abs(attempts[bestIndex].height - targetHeight);
    const deviation = Math.abs(attempt.height - targetHeight);
    return deviation < bestDeviation ? index : bestIndex;
  }, 0);
}

function loadHighscores(): HighscoreEntry[] {
  try {
    const stored = localStorage.getItem(HIGHSCORE_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return sortHighscores(
      parsed.filter(isHighscoreEntry)
    ).slice(0, 10);
  } catch (storageError) {
    console.error('Kunne ikke lese topplisten lokalt:', storageError);
    return [];
  }
}

function isHighscoreEntry(value: unknown): value is HighscoreEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.name === 'string' &&
    typeof entry.score === 'number' &&
    typeof entry.deviation === 'number' &&
    typeof entry.targetHeight === 'number' &&
    typeof entry.date === 'string' &&
    (entry.bestAttempt === undefined ||
      (typeof entry.bestAttempt === 'number' &&
        entry.bestAttempt >= 1 &&
        entry.bestAttempt <= 3))
  );
}

function sortHighscores(entries: HighscoreEntry[]) {
  return [...entries].sort(
    (first, second) =>
      second.score - first.score || first.deviation - second.deviation
  );
}

function qualifiesForHighscore(
  entries: HighscoreEntry[],
  score: number,
  deviation: number
) {
  if (entries.length < 10) return true;
  const last = sortHighscores(entries)[entries.length - 1];
  return (
    last !== undefined &&
    (score > last.score ||
      (score === last.score && deviation < last.deviation))
  );
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function distanceInMeters(first: GuessPoint, second: GuessPoint) {
  const earthRadius = 6371000;
  const lat1 = (first.lat * Math.PI) / 180;
  const lat2 = (second.lat * Math.PI) / 180;
  const deltaLat = ((second.lat - first.lat) * Math.PI) / 180;
  const deltaLng = ((second.lng - first.lng) * Math.PI) / 180;
  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(haversine));
}

function createRadiusCircle(
  center: GuessPoint,
  radiusMeters: number
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coordinates: [number, number][] = [];
  const earthRadius = 6371000;
  const angularDistance = radiusMeters / earthRadius;
  const centerLat = (center.lat * Math.PI) / 180;
  const centerLng = (center.lng * Math.PI) / 180;

  for (let index = 0; index <= 64; index += 1) {
    const bearing = (index / 64) * 2 * Math.PI;
    const latitude = Math.asin(
      Math.sin(centerLat) * Math.cos(angularDistance) +
        Math.cos(centerLat) * Math.sin(angularDistance) * Math.cos(bearing)
    );
    const longitude =
      centerLng +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(centerLat),
        Math.cos(angularDistance) - Math.sin(centerLat) * Math.sin(latitude)
      );

    coordinates.push([
      (longitude * 180) / Math.PI,
      (latitude * 180) / Math.PI,
    ]);
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
  };
}
