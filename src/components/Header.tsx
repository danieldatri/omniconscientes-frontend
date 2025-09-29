import React from 'react';
import styles from './Header.module.css';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => (
  <header className={styles.header}>
    <div className={styles.left}>omniconscientes</div>
    <div className={styles.right}>
      <button className={styles.button}>Acceder</button>
      <button className={styles.button}>Registrarse</button>
      <ThemeSwitcher />
    </div>
  </header>
);

export default Header;
