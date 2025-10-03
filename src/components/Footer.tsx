import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.css';

const quickLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Contacto', href: '#' },
  { name: 'Sobre Nosotros', href: '#' },
];

const socialLinks = [
  {
    name: 'YouTube',
    url: 'https://youtube.com/@omniconscientes',
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.454 3.5 12 3.5 12 3.5s-7.454 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 8.118 0 12 0 12s0 3.882.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.546 20.5 12 20.5 12 20.5s7.454 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 15.882 24 12 24 12s0-3.882-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/omniconscientes',
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.013 7.052.072 5.77.13 4.77.31 3.97.54c-.8.23-1.48.54-2.16 1.22C.31 2.23 0 2.91 0 3.71c-.23.8-.41 1.8-.47 3.08C-.013 8.332 0 8.736 0 12c0 3.264.013 3.668.072 4.948.058 1.28.24 2.28.47 3.08.23.8.54 1.48 1.22 2.16.68.68 1.36.99 2.16 1.22.8.23 1.8.41 3.08.47C8.332 23.987 8.736 24 12 24c3.264 0 3.668-.013 4.948-.072 1.28-.058 2.28-.24 3.08-.47.8-.23 1.48-.54 2.16-1.22.68-.68.99-1.36 1.22-2.16.23-.8.41-1.8.47-3.08.059-1.28.072-1.684.072-4.948 0-3.264-.013-3.668-.072-4.948-.058-1.28-.24-2.28-.47-3.08-.23-.8-.54-1.48-1.22-2.16-.68-.68-1.36-.99-2.16-1.22-.8-.23-1.8-.41-3.08-.47C15.668.013 15.264 0 12 0z"/><circle cx="12" cy="12" r="3.6"/><circle cx="18.406" cy="5.594" r="1.44"/></svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/omniconscientes',
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
    ),
  },
  {
    name: 'X',
    url: 'https://x.com/omniconscientes',
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2.47a.75.75 0 0 1 1.06 1.06L13.06 9l5.53 5.47a.75.75 0 1 1-1.06 1.06L12 10.06l-5.47 5.53a.75.75 0 1 1-1.06-1.06L10.94 9 5.41 3.53a.75.75 0 1 1 1.06-1.06L12 7.94l5.53-5.47z"/></svg>
    ),
  },
  {
    name: 'Pinterest',
    url: 'https://pinterest.com/omniconscientes',
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.387 7.627 11.093-.105-.943-.2-2.39.042-3.42.22-.96 1.41-6.13 1.41-6.13s-.36-.72-.36-1.78c0-1.67.97-2.92 2.18-2.92 1.03 0 1.53.77 1.53 1.7 0 1.04-.66 2.6-1 4.05-.29 1.22.62 2.22 1.83 2.22 2.2 0 3.89-2.32 3.89-5.67 0-2.97-2.14-5.05-5.2-5.05-3.54 0-5.62 2.65-5.62 5.39 0 1.07.41 2.22.92 2.85.1.12.11.23.08.36-.09.39-.29 1.22-.33 1.39-.05.22-.18.27-.41.16-1.53-.7-2.48-2.89-2.48-4.65 0-3.79 2.75-7.28 7.93-7.28 4.16 0 7.4 2.97 7.4 6.93 0 4.13-2.6 7.46-6.21 7.46-1.24 0-2.41-.64-2.81-1.37l-.77 2.93c-.23.89-.68 2-1.01 2.68.76.23 1.56.36 2.39.36 6.627 0 12-5.373 12-12S18.627 0 12 0"/></svg>
    ),
  },
  {
    name: 'Reddit',
    url: 'https://reddit.com/r/omniconscientes',
    icon: (
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.991 4.388 10.936 10.125 11.854.74.135 1.01-.321 1.01-.714 0-.353-.013-1.29-.02-2.534-4.125.896-4.995-1.99-4.995-1.99-.673-1.71-1.645-2.166-1.645-2.166-1.345-.92.102-.902.102-.902 1.487.104 2.27 1.528 2.27 1.528 1.322 2.266 3.467 1.613 4.317 1.234.134-.958.517-1.613.942-1.984-3.293-.374-6.762-1.646-6.762-7.326 0-1.618.578-2.942 1.527-3.978-.153-.375-.662-1.89.146-3.938 0 0 1.243-.398 4.075 1.52A14.13 14.13 0 0 1 12 6.844c1.26.006 2.53.17 3.717.497 2.83-1.918 4.07-1.52 4.07-1.52.81 2.048.302 3.563.15 3.938.95 1.036 1.525 2.36 1.525 3.978 0 5.692-3.475 6.948-6.785 7.316.53.457 1.003 1.36 1.003 2.742 0 1.98-.018 3.578-.018 4.065 0 .396.266.855 1.02.71C19.615 22.93 24 17.991 24 12"/></svg>
    ),
  },
];

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.top}>
      <div className={styles.brandingLeft}>
        <div className={styles.logoContainer}>
          <Image src="/logo.svg" alt="Logo Omniconscientes" width={180} height={180} className={styles.logo} />
        </div>
        <div className={styles.slogan}>
          La red del alma, un espacio para despertar, conectar y evolucionar.
        </div>
      </div>
      <div className={styles.quicklinksCenter}>
        <div className={styles.quicklinksTitle}>Enlaces Rápidos</div>
        <ul>
          {quickLinks.map(link => (
            <li key={link.name}>
              <a href={link.href} className={styles.link}>{link.name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.socialsRight}>
        <div className={styles.socialsTitle}>Síguenos <span className={styles.handle}>@omniconscientes</span></div>
        <div className={styles.socials}>
          {socialLinks.map(({ name, url, icon }) => (
            <a
              key={name}
              href={url}
              className={styles.social}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className={styles.bottom}>
      <div className={styles.copyright}>
        © 2025 omniconscientes. Todos los derechos reservados.
      </div>
      <div className={styles.legalLinks}>
        <a href="#" className={styles.link}>Política de Privacidad</a>
        <span className={styles.legalSpacer}></span>
        <a href="#" className={styles.link}>Términos de Uso</a>
      </div>
    </div>
  </footer>
);

export default Footer;
