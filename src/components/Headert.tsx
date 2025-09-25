import type { CSSProperties } from 'react';

const styles: CSSProperties = {
  height: '60px',
  width: '100vw',
  padding: '10px',
  textAlign: 'center',
  fontSize: '30px',
};

const Header = () => {
  return (
    <div style={styles}>
      <header>KART ????</header>
    </div>
  );
};

export default Header;
