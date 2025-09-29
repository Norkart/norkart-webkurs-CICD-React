
import { useState } from 'react';
import Header from './components/Header';
import {MapLibreMap} from './components/MapLibreMap';
import { SearchBar, type Address } from './components/SearchBar';

const styles = {
  overflow: 'hidden',
};

function App() {
  const [address, setAddress] = useState<Address | null>(null);

  return (
    <div style={styles}>
      <Header />
      <SearchBar setAddress={setAddress}/>
      <MapLibreMap address={address} />
    </div>
  );
}

export default App
