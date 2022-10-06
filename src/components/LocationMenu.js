import React from "react";

const menuStyle = {
  position: "absolute",
  background: "white",
  padding: 20,
  zIndex: "2",
  top: "10vh",
  display: "flex",
};

const locations = [
  { center: [10.674706290112326, 59.92544400487645], name: "Skøyen" },
  { center: [10.408773, 63.422091], name: "Trondheim" },
  { center: [7.993744574800331, 58.145072155868036], name: "Kristiansand" },
  { center: [10.457060447232827, 61.123876982347184], name: "LilleHammer" },
  { center: [5.341447457437576, 60.372653021429045], name: "Bergen" },
];

const LocationMenu = (props) => {
  const map = props.mapConnection;
  console.log(map);
  const flyTo = (coordinates) => {
    map.flyTo({ center: coordinates });
  };

  // Om vi har tilgang til kartet, render component. Ellers returner et tomt HTML objekt.
  return (
    <>
      {map ? (
        <div style={menuStyle}>
          {locations.map((location) => (
            <div key={location.center}>
              <input
                id={location.center}
                type="radio"
                name="rtoggle"
                value={location.center}
                onClick={() => flyTo(location.center)}
              />
              <label>{location.name}</label>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default LocationMenu;
