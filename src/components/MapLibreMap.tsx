import 'maplibre-gl/dist/maplibre-gl.css';
import { RMap } from 'maplibre-react-components';
import DrawComponent from './DrawComponent';

const mountain: [number, number] = [6.4546, 46.1067];

function MapLibreMap() {
  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <RMap
        minZoom={6}
        initialCenter={mountain}
        initialZoom={8}
        mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
        style={{ height: '100%', width: '100%' }}
      >
        <DrawComponent />
      </RMap>
    </div>
  );
}



export default MapLibreMap;
