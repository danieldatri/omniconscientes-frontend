"use client";

import React from 'react';
import Image from 'next/image';
import styles from './Header.module.css';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from './UserMenu';
import { useAuthUI } from "@/app/providers";
import { useAuthContext } from "@/contexts/AuthContext";
import Link from 'next/link';

const Header: React.FC = () => {
  const { openForm } = useAuthUI();
  const { user, loading } = useAuthContext();

  return (
    <header className={styles.header}>
      {/* Clickable logo + brand returns to feed/home */}
      <Link href="/" className={styles.left} aria-label="Ir al feed (home)">
        <Image src="/logo.svg" alt="Omniconscientes Logo" width={64} height={64} className={styles.logo} priority />
        <span className={styles.brand}>omniconscientes</span>
      </Link>
      <div className={styles.right}>
        {!loading && (
          <>
            {user ? (
              // Show avatar when authenticated
              <UserMenu />
            ) : (
              // Show login/register buttons when not authenticated
              <>
                <button className={styles.button} onClick={() => openForm("login")}>Sign In</button>
                <button className={styles.button} onClick={() => openForm("register")}>Sign Up</button>
                <ThemeSwitcher />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
