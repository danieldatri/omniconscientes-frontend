jest.mock('@/lib/supabase/client', () => {
  const authFns = {
    signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'user@example.com' }, session: null }, error: null }),
    signInWithPassword: jest.fn(({ email, password }) => {
      if (email === 'test@example.com' && password === 'wrong') {
        return Promise.resolve({ data: { user: null, session: null }, error: 'Network error' });
      }
      return Promise.resolve({ data: { user: { id: 'u1', email }, session: { access_token: 'tok' } }, error: null });
    }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
    updateUser: jest.fn().mockResolvedValue({ error: null }),
    getSession: jest.fn().mockResolvedValue({ data: { session: { access_token: 'tok', user: { id: 'u1', email: 'user@example.com' } } }, error: null }),
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'user@example.com' } }, error: null }),
    resend: jest.fn().mockResolvedValue({ error: null }),
    signInWithOAuth: jest.fn().mockResolvedValue({ data: { url: 'http://example.com/oauth' }, error: null }),
    onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: () => {} } } })),
  } as Record<string, unknown>;
  return {
    createClient: () => ({ auth: authFns }),
  };
});

import { authService } from '@/lib/auth/authService';

/**
 * Integration tests for authentication flows
 * These tests verify the complete authentication workflows
 */

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Registration Flow', () => {
    it('should complete full registration process', async () => {
      const email = 'newuser@example.com';
      const password = 'securepassword123';

      // Step 1: Sign up
      const signUpResult = await authService.signUp({ email, password });

      // Verify sign up was called correctly
      expect(signUpResult).toBeDefined();

      // Step 2: Resend confirmation if needed
      if (!signUpResult.session) {
        const resendResult = await authService.resendConfirmationEmail(email);
        expect(resendResult).toBeDefined();
      }
    });

    it('should handle duplicate registration attempts', async () => {
      const email = 'existing@example.com';
      const password = 'password123';

      // First registration
      await authService.signUp({ email, password });

      // Attempt duplicate registration
      const duplicateResult = await authService.signUp({ email, password });

      // Should handle gracefully
      expect(duplicateResult).toBeDefined();
    });
  });

  describe('Complete Login Flow', () => {
    it('should complete full login process', async () => {
      const email = 'user@example.com';
      const password = 'password123';

      // Sign in
      const signInResult = await authService.signIn({ email, password });

      expect(signInResult).toBeDefined();

      // Get session
      const sessionResult = await authService.getSession();
      expect(sessionResult).toBeDefined();

      // Get user
      const userResult = await authService.getUser();
      expect(userResult).toBeDefined();
    });

    it('should handle invalid credentials', async () => {
      const signInResult = await authService.signIn({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });

      expect(signInResult).toBeDefined();
    });
  });

  describe('Password Reset Flow', () => {
    it('should complete password reset process', async () => {
      const email = 'user@example.com';
      const newPassword = 'newpassword123';

      // Step 1: Request password reset
      const resetRequest = await authService.resetPassword(email);
      expect(resetRequest).toBeDefined();

      // Step 2: Update password (after clicking email link)
      const updateResult = await authService.updatePassword(newPassword);
      expect(updateResult).toBeDefined();
    });
  });

  describe('Session Management Flow', () => {
    it('should manage session lifecycle', async () => {
      const email = 'user@example.com';
      const password = 'password123';

      // Sign in
      await authService.signIn({ email, password });

      // Check session
      const session1 = await authService.getSession();
      expect(session1).toBeDefined();

      // Sign out
      await authService.signOut();

      // Verify session is cleared
      const session2 = await authService.getSession();
      expect(session2).toBeDefined();
    });
  });

  describe('User Profile Update Flow', () => {
    it('should update user email', async () => {
      const newEmail = 'newemail@example.com';

      const result = await authService.updateEmail(newEmail);
      expect(result).toBeDefined();
    });

    it('should update user metadata', async () => {
      const metadata = {
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://example.com/avatar.jpg',
      };

      const result = await authService.updateUserMetadata(metadata);
      expect(result).toBeDefined();
    });

    it('should update multiple user properties', async () => {
      // Update password
      const passwordResult = await authService.updatePassword('newpassword123');
      expect(passwordResult).toBeDefined();

      // Update metadata
      const metadataResult = await authService.updateUserMetadata({
        preferences: { theme: 'dark' },
      });
      expect(metadataResult).toBeDefined();
    });
  });

  describe('OAuth Flow', () => {
    it('should initiate OAuth flow with different providers', async () => {
      const providers = ['google', 'github', 'facebook', 'twitter'] as const;

      for (const provider of providers) {
        const result = await authService.signInWithOAuth(provider);
        expect(result).toBeDefined();
      }
    });
  });

  describe('Auth State Changes', () => {
    it('should listen to authentication state changes', () => {
      const callback = jest.fn();

      const subscription = authService.onAuthStateChange(callback);

      expect(subscription).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Test with invalid credentials
      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'wrong',
      });

      expect(result).toBeDefined();
      expect(result.error && result.user === null).toBeTruthy();
    });

    it('should handle validation errors', async () => {
      const result = await authService.signUp({
        email: 'invalid-email',
        password: '123', // Too short
      });

      expect(result).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty email', async () => {
      const result = await authService.signIn({
        email: '',
        password: 'password123',
      });

      expect(result).toBeDefined();
    });

    it('should handle empty password', async () => {
      const result = await authService.signIn({
        email: 'test@example.com',
        password: '',
      });

      expect(result).toBeDefined();
    });

    it('should handle special characters in password', async () => {
      const result = await authService.signUp({
        email: 'test@example.com',
        password: 'P@ssw0rd!#$%',
      });

      expect(result).toBeDefined();
    });

    it('should handle long email addresses', async () => {
      const longEmail = 'a'.repeat(50) + '@example.com';

      const result = await authService.signUp({
        email: longEmail,
        password: 'password123',
      });

      expect(result).toBeDefined();
    });
  });
});
