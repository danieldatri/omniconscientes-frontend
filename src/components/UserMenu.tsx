"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { authService } from '@/lib/auth/authService';
import { useRouter } from 'next/navigation';

const UserMenu: React.FC = () => {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
    router.push('/');
  };

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path);
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
            {/* Home / Feed */}
            <button
              onClick={() => navigateTo('/')}
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Profile</span>
            </button>

            <button
              onClick={() => navigateTo('/settings')}
              className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors"
              style={{ color: 'var(--text)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Settings</span>
            </button>

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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Contact</span>
            </button>

            <div className="my-2 border-t" style={{ borderColor: 'var(--border)' }} />

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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
