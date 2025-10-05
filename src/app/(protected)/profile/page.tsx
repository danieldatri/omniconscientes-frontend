"use client";

import React, { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

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

  const userEmail = user.email || '';
  const userName = user.user_metadata?.full_name || userEmail.split('@')[0] || 'User';

  return (
    <div className="min-h-screen py-12 px-4" style={{ color: 'var(--text)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 p-8 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div
                className="flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold"
                style={{ background: 'var(--primary)', color: 'var(--text)' }}
              >
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{userName}</h1>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  Member since 2023
                </p>
                <div className="flex gap-2">
                  <span
                    className="px-3 py-1 text-sm rounded"
                    style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}
                  >
                    Advanced Numerology
                  </span>
                  <span
                    className="px-3 py-1 text-sm rounded"
                    style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}
                  >
                    Active Student
                  </span>
                </div>
              </div>
            </div>
            <button
              className="px-4 py-2 rounded font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--primary)', color: 'var(--text)' }}
              onClick={() => router.push('/settings')}
            >
              ✏️ Edit
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-8 p-8 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-2xl font-bold mb-6">Personal Information</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg" style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Birth Date</h3>
                <p style={{ color: 'var(--text-muted)' }}>October 20, 1978</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg" style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p style={{ color: 'var(--text-muted)' }}>{userEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg" style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p style={{ color: 'var(--text-muted)' }}>Buenos Aires, Argentina</p>
              </div>
            </div>
          </div>
        </div>

        {/* Numerology Summary */}
        <div className="mb-8 p-8 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-2xl font-bold mb-6">Numerology Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 rounded-lg" style={{ background: 'rgba(var(--primary-rgb), 0.05)' }}>
              <div className="text-5xl font-bold mb-2" style={{ color: 'var(--primary)' }}>2</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Soul Number</p>
            </div>

            <div className="text-center p-6 rounded-lg" style={{ background: 'rgba(var(--primary-rgb), 0.05)' }}>
              <div className="text-5xl font-bold mb-2" style={{ color: 'var(--primary)' }}>10</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Karma</p>
            </div>

            <div className="text-center p-6 rounded-lg" style={{ background: 'rgba(var(--primary-rgb), 0.05)' }}>
              <div className="text-5xl font-bold mb-2" style={{ color: 'var(--primary)' }}>6</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Main Gift</p>
            </div>

            <div className="text-center p-6 rounded-lg" style={{ background: 'rgba(var(--primary-rgb), 0.05)' }}>
              <div className="text-5xl font-bold mb-2" style={{ color: 'var(--primary)' }}>3</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Personal Year</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-8 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--primary)' }}></div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Completed Numerology 101 Course</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>2 days ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--primary)' }}></div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Updated your numerology chart</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>1 week ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'var(--primary)' }}></div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Joined Omniconscientes</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>3 months ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
