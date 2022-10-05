import { useState } from "react";
import { FritekstSok } from "./FritekstSok";

const AdresseBoksStyle = {
  position: "absolute",
  background: "white",
  padding: 20,
  zIndex: "2",
  bottom: 220,
  right: 20,
  display: "flex",
};

export const AdresseBoks = (props) => {
  const [info, setInfo] = useState(null);

  return (
    <>
      {info ? (
        <div style={AdresseBoksStyle}>
          <ul>
            <li>id: {info.id}</li>
            <li>Latitude: {info.latlng.lat}</li>
            <li>Longitude: {info.latlng.lng}</li>
            <li>Text: {info.text}</li>
          </ul>
        </div>
      ) : (
        <></>
      )}
      <FritekstSok info={info} setInfo={setInfo}></FritekstSok>
    </>
  );
};
