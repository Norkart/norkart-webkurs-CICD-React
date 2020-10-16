import React from 'react'

const menuStyle = {
    position: "absolute",
    background: "white",
    padding: 10,
    zIndex: "1",
    display: "flex",
};

const backgroundLayers = [
    { id: "streets-v11", name: "Streets" },
    { id: "light-v10", name: "Light" },
    { id: "dark-v10", name: "Dark" },
    { id: "satellite-v9", name: "Satellite" },
];

const MapStyleMenu = (props) => {
    return (
        <div style={menuStyle}>
            {backgroundLayers.map((backgroundLayer) => (
                <div key={backgroundLayer.id}>
                    <input
                        id={backgroundLayer.id}
                        type="radio"
                        name="rtoggle"
                        value={backgroundLayer.id}
                        onClick={() => props.setbackgroundLayerID(backgroundLayer.id)}
                        defaultChecked={backgroundLayer.id === props.backgroundLayerID}
                    />
                    <label>{backgroundLayer.name}</label>
                </div>
            ))}
        </div>
    )
}

export default MapStyleMenu
