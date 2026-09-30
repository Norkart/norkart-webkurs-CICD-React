export const getBygningAtPunkt = async (x: number, y: number) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const query = `https://bygning.api.norkart.no/bygninger/byposition?x=${x}&y=${y}&MaxRadius=5&GeometryTextFormat=GeoJson&IncludeFkbData=true`;

  try {
    const apiResult = await fetch(query, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-WAAPI-TOKEN': `${apiKey}`,
      },
    });

    if (apiResult.ok) {
      const data = await apiResult.json();
      const bygninger = Array.isArray(data) ? data : (data?.Bygninger ?? []);

      if (!bygninger.length) {
        return null;
      }

      const bestMatch = [...bygninger].sort((a, b) => {
        const areaA = getGeometryArea(a?.FkbData?.BygningsOmriss);
        const areaB = getGeometryArea(b?.FkbData?.BygningsOmriss);
        return areaB - areaA;
      })[0];

      return bestMatch ?? null;
    } else {
      console.error('API request failed with status:', apiResult.status);
      const errorText = await apiResult.text();
      console.error('API error body:', errorText);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
    return null;
  }
};

function getGeometryArea(geometryText: string | undefined): number {
  if (!geometryText) {
    return 0;
  }

  try {
    const geometry = JSON.parse(geometryText) as {
      type?: string;
      coordinates?: number[][][] | number[][][][];
    };

    if (geometry.type === 'Polygon' && Array.isArray(geometry.coordinates)) {
      return getPolygonArea(geometry.coordinates as number[][][]);
    }

    if (
      geometry.type === 'MultiPolygon' &&
      Array.isArray(geometry.coordinates)
    ) {
      return (geometry.coordinates as number[][][][]).reduce(
        (sum, polygon) => sum + getPolygonArea(polygon),
        0
      );
    }

    return 0;
  } catch {
    return 0;
  }
}

function getPolygonArea(coordinates: number[][][]): number {
  if (!coordinates.length || !coordinates[0].length) {
    return 0;
  }

  const ring = coordinates[0];
  let area = 0;

  for (let index = 0; index < ring.length - 1; index += 1) {
    const [x1, y1] = ring[index];
    const [x2, y2] = ring[index + 1];
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area) / 2;
}
