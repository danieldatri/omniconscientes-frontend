"use client";

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [userName, setUserName] = useState('Daniel Datri');
  const [bio, setBio] = useState('Numerology student and spiritual growth enthusiast.');
  const [location, setLocation] = useState('Buenos Aires, Argentina');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [theme, setTheme] = useState('Dark');
  const [language, setLanguage] = useState('English');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center" style={{ color: 'var(--text)' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMessage('Changes saved successfully');
    setSaving(false);

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ color: 'var(--text)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p style={{ color: 'var(--text-muted)' }}>Customize your Omniconscientes experience</p>
        </div>

        {/* Profile */}
        <div className="mb-6 p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-2xl font-bold">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">User Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Biography</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg resize-none"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6 p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h2 className="text-2xl font-bold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Push Notifications</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Receive real-time notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ background: pushNotifications ? 'var(--primary)' : '#6b7280' }}
                ></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Email Updates</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Receive weekly summaries via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ background: emailUpdates ? 'var(--primary)' : '#6b7280' }}
                ></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="mb-6 p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold">Privacy</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Private Profile</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Only you can see your complete information</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privateProfile}
                onChange={(e) => setPrivateProfile(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ background: privateProfile ? 'var(--primary)' : '#6b7280' }}
              ></div>
            </label>
          </div>
        </div>

        {/* Appearance */}
        <div className="mb-6 p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <h2 className="text-2xl font-bold">Appearance</h2>
          </div>

          <div>
            <label className="block mb-2 font-medium">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-3 rounded-lg cursor-pointer"
              style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <option>Dark</option>
              <option>Light</option>
              <option>System</option>
            </select>
          </div>
        </div>

        {/* Language and Region */}
        <div className="mb-6 p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <h2 className="text-2xl font-bold">Language & Region</h2>
          </div>

          <div>
            <label className="block mb-2 font-medium">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg cursor-pointer"
              style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <option>English</option>
              <option>Español</option>
              <option>Português</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          {message && (
            <span className="text-sm" style={{ color: 'var(--primary)' }}>{message}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--primary)', color: 'var(--text)' }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
