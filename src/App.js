import React from "react";
import Header from "./components/Header";
import MapboxGLMap from "./components/MapboxGLMap";

const styles = {
  overflow: "hidden",
};

function App() {
  return (
    <div style={styles}>
    kari was here
      <Header />
      <MapboxGLMap />
    </div>
  );
}

export default App;
