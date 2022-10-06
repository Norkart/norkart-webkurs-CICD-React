import React from "react";

const menuStyle = {
  position: "absolute",
  background: "white",
  padding: 20,
  zIndex: "2",
  top: "20vh",
  display: "flex",
};

const backgroundLayers = [
  { name: 'Kart', id: "streets-v11" },
  { name: 'Light', id: "light-v10" },
  { name: 'Dark', id: "dark-v10" },
  { name: 'Satelite', id: "satellite-v9" },
];

const BackgroundMapChange = (props) => {
  const map = props.mapConnection;
  

  // Om vi har tilgang til kartet, render component. Ellers returner et tomt HTML objekt.
  return (
    <>
      {map ? (
        <div style={menuStyle}>
          {backgroundLayers.map((layer) => (
            <div key={layer.id}>
              <input
                id={layer.id}
                type="radio"
                name="rtoggle"
                value={layer.name}
                onClick={() => map.setStyle(`mapbox://styles/mapbox/${layer.id}`)}
              />
              <label>{layer.name}</label>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default BackgroundMapChange;
