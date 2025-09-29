import React from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => (
  <header className={styles.header}>
    <div className={styles.left}>
      <Image src="/logo.svg" alt="Logo Omniconscientes" width={64} height={64} className={styles.logo} priority />
      <span className={styles.brand}>omniconscientes</span>
    </div>
    <div className={styles.right}>
      <button className={styles.button}>Acceder</button>
      <button className={styles.button}>Registrarse</button>
      <ThemeSwitcher />
    </div>
  </header>
);

export default Header;
