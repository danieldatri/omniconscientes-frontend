"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { authService } from '@/lib/auth/authService';
import { useRouter } from 'next/navigation';

const UserMenu: React.FC = () => {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'display', 'settings', 'language', 'languageSelect'
  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [languageSearch, setLanguageSearch] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const languages = [
    { code: 'en-US', name: 'English (US)', subtitle: 'English (US) • Recent' },
    { code: 'es', name: 'Español', subtitle: 'Spanish • Suggested' },
    { code: 'pt-BR', name: 'Português (Brasil)', subtitle: 'Portuguese (Brazil) • Suggested' },
  ];

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    lang.subtitle.toLowerCase().includes(languageSearch.toLowerCase())
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setCurrentView('main');
        setIsTransitioning(false);
        setLanguageSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await authService.signOut();
    setIsOpen(false);
    setCurrentView('main');
    setIsTransitioning(false);
    router.push('/');
  };

  const navigateTo = (path: string) => {
    setIsOpen(false);
    setCurrentView('main');
    setIsTransitioning(false);
    router.push(path);
  };

  const transitionToView = (view: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 150);
  };

  const showDisplayMenu = () => transitionToView('display');
  const showSettingsMenu = () => transitionToView('settings');
  const showLanguageMenu = () => transitionToView('language');
  const showLanguageSelect = () => transitionToView('languageSelect');
  const goBackToMain = () => transitionToView('main');
  const goBackToSettings = () => transitionToView('settings');
  const goBackToLanguage = () => transitionToView('language');

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    console.log('Theme changed to:', theme);
  };

  const handleLanguageChange = (language: { code: string; name: string; subtitle: string }) => {
    setSelectedLanguage(language.name);
    console.log('Language changed to:', language);
    goBackToLanguage();
  };

  // Generate avatar with initials
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden transition-all hover:ring-2 hover:ring-primary"
        style={{
          background: 'var(--primary)',
          color: 'var(--text)',
        }}
        aria-label="User menu"
      >
        <span className="font-semibold text-sm">{getInitials()}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            zIndex: 1000,
          }}
        >
          <div className="relative">
            {/* Main Menu */}
            <div
              className={`transition-transform duration-300 ease-in-out ${
                currentView === 'main' ? 'translate-x-0' : '-translate-x-full'
              }`}
              style={{
                opacity: isTransitioning && currentView === 'main' ? 0.7 : 1,
              }}
            >
              {/* User Info */}
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full"
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--text)',
                    }}
                  >
                    <span className="font-bold text-lg">{getInitials()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: 'var(--text)' }}>
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      Member since 2023
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <span
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      background: 'rgba(var(--primary-rgb), 0.1)',
                      color: 'var(--primary)',
                    }}
                  >
                    Advanced Numerology
                  </span>
                  <span
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      background: 'rgba(var(--primary-rgb), 0.1)',
                      color: 'var(--primary)',
                    }}
                  >
                    Active Student
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* Home */}
                <button
                  onClick={() => navigateTo('/home')}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors hover:bg-opacity-10"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </button>

                {/* Profile */}
                <button
                  onClick={() => navigateTo('/profile')}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors hover:bg-opacity-10"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </button>

                {/* Settings */}
                <button
                  onClick={showSettingsMenu}
                  disabled={isTransitioning}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors disabled:opacity-50"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    if (!isTransitioning) {
                      e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="flex-1 flex items-center justify-between">
                    <span>Settings</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isTransitioning ? 'translate-x-1' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Display & accessibility */}
                <button
                  onClick={showDisplayMenu}
                  disabled={isTransitioning}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors disabled:opacity-50"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    if (!isTransitioning) {
                      e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1 flex items-center justify-between">
                    <span>Display & accessibility</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isTransitioning ? 'translate-x-1' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Contact */}
                <button
                  onClick={() => navigateTo('/contact')}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contact</span>
                </button>

                <div className="my-2 border-t" style={{ borderColor: 'var(--border)' }} />

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors"
                  style={{ color: '#ef4444' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Settings submenu */}
            <div
              className={`absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out ${
                currentView === 'settings' ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{
                opacity: isTransitioning && currentView === 'settings' ? 0.7 : 1,
              }}
            >
              <div className="py-2">
                {/* Back button */}
                <button
                  onClick={goBackToMain}
                  disabled={isTransitioning}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b disabled:opacity-50"
                  style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                  onMouseEnter={(e) => {
                    if (!isTransitioning) {
                      e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isTransitioning ? '-translate-x-1' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="font-semibold">Settings</div>
                  </div>
                </button>

                {/* Personal Information */}
                <button
                  onClick={() => navigateTo('/settings/personal')}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Personal Information</span>
                </button>

                {/* Language */}
                <button
                  onClick={showLanguageMenu}
                  disabled={isTransitioning}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors disabled:opacity-50"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    if (!isTransitioning) {
                      e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <div className="flex-1 flex items-center justify-between">
                    <span>Language</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isTransitioning ? 'translate-x-1' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Privacy */}
                <button
                  onClick={() => navigateTo('/settings/privacy')}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Privacy</span>
                </button>
              </div>
            </div>

            {/* Language submenu */}
            <div
              className={`absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out ${
                currentView === 'language' ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{
                opacity: isTransitioning && currentView === 'language' ? 0.7 : 1,
              }}
            >
              <div className="py-2">
                {/* Back button */}
                <button
                  onClick={goBackToSettings}
                  disabled={isTransitioning}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b disabled:opacity-50"
                  style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                  onMouseEnter={(e) => {
                    if (!isTransitioning) {
                      e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isTransitioning ? '-translate-x-1' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="font-semibold">Language</div>
                  </div>
                </button>

                <div className="px-4 py-2">
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    Language and region
                  </p>

                  {/* Language Selection */}
                  <button
                    onClick={showLanguageSelect}
                    disabled={isTransitioning}
                    className="w-full p-3 rounded-lg text-left flex items-center gap-3 transition-colors disabled:opacity-50"
                    style={{
                      background: 'rgba(var(--primary-rgb), 0.1)',
                      border: '1px solid var(--primary)',
                      color: 'var(--text)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isTransitioning) {
                        e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="font-medium">Language</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {selectedLanguage}
                        </div>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isTransitioning ? 'translate-x-1' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Language Selection submenu */}
            <div
              className={`absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out ${
                currentView === 'languageSelect' ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{
                opacity: isTransitioning && currentView === 'languageSelect' ? 0.7 : 1,
              }}
            >
              <div className="py-2">
                {/* Back button */}
                <button
                  onClick={goBackToLanguage}
                  disabled={isTransitioning}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b disabled:opacity-50"
                  style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                  onMouseEnter={(e) => {
                    if (!isTransitioning) {
                      e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isTransitioning ? '-translate-x-1' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="font-semibold">Language</div>
                  </div>
                </button>

                <div className="px-4 py-2">
                  {/* Search */}
                  <div className="relative mb-4">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: 'var(--text-muted)' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search languages"
                      value={languageSearch}
                      onChange={(e) => setLanguageSearch(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-lg text-sm"
                      style={{
                        background: 'var(--background)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)'
                      }}
                    />
                  </div>

                  {/* Language options */}
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {filteredLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className="w-full p-3 rounded-lg text-left flex items-center justify-between transition-colors"
                        style={{
                          background: selectedLanguage === language.name ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                          color: 'var(--text)'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedLanguage !== language.name) {
                            e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedLanguage !== language.name) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <div>
                          <div className="font-medium">{language.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {language.subtitle}
                          </div>
                        </div>
                        {selectedLanguage === language.name && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--primary)', color: 'var(--text)' }}
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Display & accessibility submenu */}
            <div
              className={`absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out ${
                currentView === 'display' ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{
                opacity: isTransitioning && currentView === 'display' ? 0.7 : 1,
              }}
            >
              <div className="py-2">
                {/* Back button */}
                <button
                  onClick={goBackToMain}
                  disabled={isTransitioning}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b disabled:opacity-50"
                  style={{ color: 'var(--text)', borderColor: 'var(--border)' }}
                  onMouseEnter={(e) => {
                    if (!isTransitioning) {
                      e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isTransitioning ? '-translate-x-1' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <div className="font-semibold">Display & accessibility</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Adjust the appearance of the app
                    </div>
                  </div>
                </button>

                {/* Theme section */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>Dark mode</span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    Adjust the appearance to reduce glare and give your eyes a break.
                  </p>

                  {/* Theme options */}
                  <div className="space-y-2">
                    {['Off', 'On', 'Automatic'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleThemeChange(theme)}
                        className="w-full p-3 rounded-lg text-left flex items-center justify-between transition-colors"
                        style={{
                          background: selectedTheme === theme ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                          color: 'var(--text)'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedTheme !== theme) {
                            e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTheme !== theme) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <div>
                          <div className="font-medium">{theme}</div>
                          {theme === 'Automatic' && (
                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              We&#39;ll automatically adjust the display based on your device&#39;s settings.
                            </div>
                          )}
                        </div>
                        {selectedTheme === theme && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--primary)', color: 'var(--text)' }}
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
