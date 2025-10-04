"use client";

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSuccessMessage('Message sent successfully! We\'ll respond soon.');
    setSending(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    });

    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ color: 'var(--text)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Have any questions? We&apos;re here to help
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-lg text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="mb-2" style={{ color: 'var(--text-muted)' }}>support@omniconscientes.com</p>
          </div>

          <div className="p-6 rounded-lg text-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
            <p style={{ color: 'var(--text-muted)' }}>Available 24/7</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Your first name"
                  required
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Your last name"
                  required
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
                className="w-full px-4 py-3 rounded-lg"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your inquiry or comment..."
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg resize-none"
                style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            {successMessage && (
              <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid #22c55e' }}>
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-lg font-semibold text-lg transition-opacity hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'var(--primary)', color: 'var(--text)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 p-8 rounded-lg" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-lg">How does numerology work at Omniconscientes?</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                We use your birth date to calculate your personal numbers and generate your complete numerology chart.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-lg">Can I change my personal information?</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Yes, you can update your information in your profile settings section.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-lg">How do I access my numerology chart?</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Go to the &quot;Numerology&quot; section and then select &quot;My Chart&quot; to see your complete analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
