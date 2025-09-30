import { useState } from 'react';
import { FritekstSok } from './FritekstSok';

const AdresseBoksStyle = {
  position: 'absolute',
  background: 'white',
  padding: 20,
  zIndex: '2',
  top: 60,
  right: 0,
};

export const AdresseBoks = () => {
  const [selectedAdress, setSelectedAdress] = useState(null);

  return (
    <div style={AdresseBoksStyle}>
      <FritekstSok
        selectedAdress={selectedAdress}
        setSelectedAdress={setSelectedAdress}
      ></FritekstSok>
      {selectedAdress ? (
        <div>
          <ul>
            <li>id: {selectedAdress.id}</li>
            <li>Latitude: {selectedAdress.latlng.lat}</li>
            <li>Longitude: {selectedAdress.latlng.lng}</li>
            <li>Text: {selectedAdress.text}</li>
          </ul>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
