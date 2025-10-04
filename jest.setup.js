/* eslint-disable @typescript-eslint/no-require-imports */
require('@testing-library/jest-dom');
const { TextEncoder, TextDecoder } = require('util');

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';

// Removed manual window.location reassignment to avoid jsdom navigation errors
// Tests relying on origin should use process.env.NEXT_PUBLIC_SITE_URL via service baseUrl resolution.
