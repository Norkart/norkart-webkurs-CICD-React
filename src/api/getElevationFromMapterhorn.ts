const MAPTERHORN_TILE_URL =
  'https://tiles.mapterhorn.com/{z}/{x}/{y}.webp';
const ELEVATION_ZOOM = 12;
const TILE_SIZE = 512;
const MIN_LATITUDE = -85.05112878;
const MAX_LATITUDE = 85.05112878;

export async function getElevationFromMapterhorn(
  lng: number,
  lat: number
): Promise<number> {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    throw new Error('Ugyldige koordinater for Mapterhorn-oppslag.');
  }

  const boundedLatitude = Math.max(
    MIN_LATITUDE,
    Math.min(MAX_LATITUDE, lat)
  );
  const normalizedLongitude = ((lng + 180) % 360 + 360) % 360;
  const scale = 2 ** ELEVATION_ZOOM;
  const x = (normalizedLongitude / 360) * scale;
  const latitudeRadians = (boundedLatitude * Math.PI) / 180;
  const y =
    ((1 - Math.asinh(Math.tan(latitudeRadians)) / Math.PI) / 2) * scale;
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);
  const pixelX = (x - tileX) * TILE_SIZE;
  const pixelY = (y - tileY) * TILE_SIZE;

  const tileUrl = MAPTERHORN_TILE_URL
    .replace('{z}', String(ELEVATION_ZOOM))
    .replace('{x}', String(tileX))
    .replace('{y}', String(tileY));
  const response = await fetch(tileUrl);
  if (!response.ok) {
    throw new Error(`Mapterhorn-flis feilet med HTTP ${response.status}.`);
  }

  const image = await createImageBitmap(await response.blob());
  try {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Kunne ikke lese Mapterhorn-flisen.');
    }

    context.drawImage(image, 0, 0);
    const left = Math.min(TILE_SIZE - 1, Math.floor(pixelX));
    const top = Math.min(TILE_SIZE - 1, Math.floor(pixelY));
    const right = Math.min(TILE_SIZE - 1, left + 1);
    const bottom = Math.min(TILE_SIZE - 1, top + 1);
    const xWeight = pixelX - left;
    const yWeight = pixelY - top;
    const topLeft = readTerrariumPixel(context, left, top);
    const topRight = readTerrariumPixel(context, right, top);
    const bottomLeft = readTerrariumPixel(context, left, bottom);
    const bottomRight = readTerrariumPixel(context, right, bottom);
    const topElevation = topLeft * (1 - xWeight) + topRight * xWeight;
    const bottomElevation =
      bottomLeft * (1 - xWeight) + bottomRight * xWeight;
    const elevation = topElevation * (1 - yWeight) + bottomElevation * yWeight;

    if (!Number.isFinite(elevation) || elevation < -50 || elevation > 3000) {
      throw new Error('Mapterhorn-flisen inneholder ingen gyldig høyde.');
    }
    return elevation;
  } finally {
    image.close();
  }
}

function readTerrariumPixel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  const [red, green, blue] = context.getImageData(x, y, 1, 1).data;
  return red * 256 + green + blue / 256 - 32768;
}
