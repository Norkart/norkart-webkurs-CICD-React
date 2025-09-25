
import Header from './components/Headert';
import MapLibreMap from './components/MapLibreMap';

const styles = {
  overflow: 'hidden',
};

function App() {
  return (
    <div style={styles}>
      <Header />
      <MapLibreMap />
    </div>
  );
}

export default App
