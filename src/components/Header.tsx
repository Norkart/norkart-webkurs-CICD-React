import type { CSSProperties } from 'react';
import NorkartLogo from '../assets/norkart_logo.svg';

const styles: CSSProperties = {
  height: 'var(--header-height)',
  boxSizing: 'border-box',
  width: '100vw',
  padding: '10px 30px',
  textAlign: 'center',
  fontSize: '30px',
  position: 'sticky',
  display: 'flex',
  alignItems: 'center',
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 4px',
  zIndex: 1200,
};

const Header = () => {
  return (
    <header style={styles}>
      <img height="50px" src={NorkartLogo} />
      <h1 style={{ fontSize: '1.5rem' }}>Norkart Workshop</h1>
    </header>
  );
};

export default Header;
