"use client";

import React from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuthUI } from "@/app/providers";

const Header: React.FC = () => {
  const { openForm } = useAuthUI();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Image src="/logo.svg" alt="Logo Omniconscientes" width={64} height={64} className={styles.logo} priority />
        <span className={styles.brand}>omniconscientes</span>
      </div>
      <div className={styles.right}>
        <button className={styles.button} onClick={() => openForm("login")}>Ingresar</button>
        <button className={styles.button} onClick={() => openForm("register")}>Registrarse</button>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
