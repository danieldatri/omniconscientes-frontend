"use client";

import React from 'react';

export default function Feed() {
  return (
    <div className="w-full min-h-screen py-12 px-4" style={{ color: 'var(--text)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Omniconscientes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Discover your spiritual journey through numerology</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Course */}
            <div className="p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}>
                    Featured Course
                  </span>
                  <h2 className="text-2xl font-bold mt-2 mb-2">Numerology 101: Foundations</h2>
                  <p style={{ color: 'var(--text-muted)' }} className="mb-4">
                    Learn the basics of numerology and discover how numbers influence your life path.
                  </p>
                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span>📚 12 lessons</span>
                    <span>⏱️ 3 hours</span>
                    <span>⭐ 4.9/5</span>
                  </div>
                  <button className="mt-4 px-6 py-2 rounded-lg font-semibold transition-opacity hover:opacity-80" style={{ background: 'var(--primary)', color: 'var(--text)' }}>
                    Start Course
                  </button>
                </div>
              </div>
            </div>

            {/* Video Post */}
            <div className="p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--primary)', color: 'var(--text)' }}>
                  OC
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Omniconscientes</span>
                    <span style={{ color: 'var(--text-muted)' }} className="text-sm">• 2 days ago</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Understanding Your Life Path Number</h3>
                  <div className="aspect-video mb-3 rounded-lg flex items-center justify-center" style={{ background: 'var(--background)' }}>
                    <svg className="w-16 h-16" style={{ color: 'var(--primary)' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--text-muted)' }} className="mb-3">
                    Discover how to calculate and interpret your life path number in this comprehensive guide.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      124
                    </button>
                    <button className="flex items-center gap-1 hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      23
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Post */}
            <div className="p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--primary)', color: 'var(--text)' }}>
                  OC
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">Omniconscientes</span>
                    <span style={{ color: 'var(--text-muted)' }} className="text-sm">• 1 week ago</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">The Power of Master Numbers: 11, 22, and 33</h3>
                  <p style={{ color: 'var(--text-muted)' }} className="mb-3">
                    Master numbers carry special significance in numerology. Learn what it means if you have one in your chart and how to harness its energy for personal growth.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      89
                    </button>
                    <button className="flex items-center gap-1 hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      15
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Numbers Card */}
            <div className="p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h3 className="font-bold mb-4">Your Numbers</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-muted)' }} className="text-sm">Life Path</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-muted)' }} className="text-sm">Soul Number</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-muted)' }} className="text-sm">Destiny</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>7</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-80" style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}>
                View Full Chart
              </button>
            </div>

            {/* Upcoming Events */}
            <div className="p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h3 className="font-bold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs mb-1" style={{ color: 'var(--primary)' }}>Tomorrow, 7:00 PM</div>
                  <div className="font-semibold text-sm mb-1">Live Q&A: Numerology Basics</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>with Master Instructor</div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: 'var(--primary)' }}>Jan 15, 6:00 PM</div>
                  <div className="font-semibold text-sm mb-1">Workshop: Personal Year Reading</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Interactive Session</div>
                </div>
              </div>
            </div>

            {/* Popular Courses */}
            <div className="p-6 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h3 className="font-bold mb-4">Popular Courses</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary)' }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">Advanced Chart Reading</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>16 lessons • 5 hours</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary)' }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-1">Spiritual Awakening</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>10 lessons • 3 hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

