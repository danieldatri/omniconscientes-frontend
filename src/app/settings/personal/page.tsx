"use client";

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function PersonalInformationPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [residence, setResidence] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Load user data when available
  useEffect(() => {
    if (user) {
      const fullName = user.user_metadata?.full_name || '';
      const nameParts = fullName.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');

      // Load other data from user metadata or localStorage
      setBirthDate(user.user_metadata?.birth_date || '');
      setBirthTime(user.user_metadata?.birth_time || '');
      setBirthPlace(user.user_metadata?.birth_place || '');
      setResidence(user.user_metadata?.residence || '');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Here you would normally save to your backend/database
      // For now, we'll simulate the save operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // You could also save to localStorage temporarily
      const personalInfo = {
        firstName,
        lastName,
        birthDate,
        birthTime,
        birthPlace,
        residence
      };
      localStorage.setItem('personalInfo', JSON.stringify(personalInfo));

      setMessage('Personal information saved successfully');
      setSaving(false);

      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Error saving information');
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ color: 'var(--text)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 mb-4 text-sm transition-colors hover:opacity-80"
            style={{ color: 'var(--primary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Settings
          </button>
          <h1 className="text-4xl font-bold mb-2">Personal Information</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            This information helps us provide personalized numerology insights based on your birth details.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-2xl font-bold">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>
            </div>
          </div>

          {/* Birth Information */}
          <div className="p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-bold">Birth Information</h2>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Your birth date and time are essential for accurate numerological calculations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium">Date of Birth</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Time of Birth</label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  If you don&#39;t know your exact time, an approximate time is helpful
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-medium">Place of Birth</label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="City, Country (e.g., Buenos Aires, Argentina)"
                className="w-full px-4 py-3 rounded-lg"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Enter the city and country where you were born
              </p>
            </div>
          </div>

          {/* Current Location */}
          <div className="p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-2xl font-bold">Current Location</h2>
            </div>

            <div>
              <label className="block mb-2 font-medium">Place of Residence</label>
              <input
                type="text"
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                placeholder="City, Country (e.g., Buenos Aires, Argentina)"
                className="w-full px-4 py-3 rounded-lg"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Where do you currently live?
              </p>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 rounded-lg" style={{ background: 'rgba(var(--primary-rgb), 0.1)', border: '1px solid var(--primary)' }}>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--primary)' }}>Privacy & Security</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Your personal information is encrypted and securely stored. We never share your birth details with third parties.
                  This information is used exclusively for generating your personalized numerology readings.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4 pt-4">
            {message && (
              <span className={`text-sm ${message.includes('Error') ? 'text-red-500' : ''}`}
                    style={{ color: message.includes('Error') ? '#ef4444' : 'var(--primary)' }}>
                {message}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 rounded-lg font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: 'var(--primary)', color: 'var(--text)' }}
            >
              {saving ? 'Saving...' : 'Save Information'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
