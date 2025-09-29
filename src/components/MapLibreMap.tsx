import type { MapLayerMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RMap } from 'maplibre-react-components';
import { getHoydeFromPunkt } from '../api/getHoydeFromPunkt';
import { useEffect, useState } from 'react';


const trondheim: [number, number] = [10.40565401, 63.4156575];

export const MapLibreMap = () => {
    const [hoyde, setHoydeAtPunkt] = useState<undefined | number>(undefined);

    useEffect(() => {
        console.log(hoyde);
    }, [hoyde]);

    const onMapClick = async (e: MapLayerMouseEvent) => {
        const hoyder = await getHoydeFromPunkt(e.lngLat.lng, e.lngLat.lat);
        setHoydeAtPunkt(hoyder[0].Z)
    }

    return (
        <div style={{ position: 'relative', height: '80vh', width: '100%' }}>
            <RMap
                minZoom={6}
                initialCenter={trondheim}
                initialZoom={12}
                mapStyle="https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json"
                style={{ height: '100%', width: '100%' }}
                onClick={onMapClick}
            />
        </div>
    );
}