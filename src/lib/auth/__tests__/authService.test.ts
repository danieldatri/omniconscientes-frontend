import { AuthService } from '@/lib/auth/authService';
import { createClient } from '@/lib/supabase/client';
import type { AuthError, User, Session } from '@supabase/supabase-js';

// Mock the Supabase client
jest.mock('@/lib/supabase/client');

describe('AuthService', () => {
  let mockSupabase: {
    auth: {
      signUp: jest.Mock;
      signInWithPassword: jest.Mock;
      signOut: jest.Mock;
      resetPasswordForEmail: jest.Mock;
      updateUser: jest.Mock;
      getSession: jest.Mock;
      getUser: jest.Mock;
      resend: jest.Mock;
      signInWithOAuth: jest.Mock;
      onAuthStateChange: jest.Mock;
    };
  };
  let service: AuthService;

  beforeEach(() => {
    // Create mock Supabase client
    mockSupabase = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        resetPasswordForEmail: jest.fn(),
        updateUser: jest.fn(),
        getSession: jest.fn(),
        getUser: jest.fn(),
        resend: jest.fn(),
        signInWithOAuth: jest.fn(),
        onAuthStateChange: jest.fn(),
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    service = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully register a new user', async () => {
      const mockUser: Partial<User> = {
        id: 'user-123',
        email: 'test@example.com',
      };

      const mockSession: Partial<Session> = {
        access_token: 'token-123',
        user: mockUser as User,
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await service.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: undefined,
          emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
      });

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should return error when email already exists', async () => {
      const mockError: Partial<AuthError> = {
        message: 'User already registered',
        name: 'AuthApiError',
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await service.signUp({
        email: 'existing@example.com',
        password: 'password123',
      });

      expect(result.user).toBeNull();
      expect(result.error).toEqual(mockError);
    });

    it('should include metadata when provided', async () => {
      const metadata = { firstName: 'John', lastName: 'Doe' };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      await service.signUp({
        email: 'test@example.com',
        password: 'password123',
        metadata,
      });

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: metadata,
          emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
      });
    });
  });

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      const mockUser: Partial<User> = {
        id: 'user-123',
        email: 'test@example.com',
      };

      const mockSession: Partial<Session> = {
        access_token: 'token-123',
        user: mockUser as User,
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const result = await service.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should return error with invalid credentials', async () => {
      const mockError: Partial<AuthError> = {
        message: 'Invalid login credentials',
        name: 'AuthApiError',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });

      const result = await service.signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.user).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      const result = await service.signOut();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it('should handle sign out errors', async () => {
      const mockError: Partial<AuthError> = {
        message: 'Sign out failed',
        name: 'AuthApiError',
      };

      mockSupabase.auth.signOut.mockResolvedValue({ error: mockError });

      const result = await service.signOut();

      expect(result.error).toEqual(mockError);
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email successfully', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await service.resetPassword('test@example.com');

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: 'http://localhost:3000/auth/reset-password',
        }
      );

      expect(result.error).toBeNull();
    });

    it('should handle errors when email does not exist', async () => {
      const mockError: Partial<AuthError> = {
        message: 'User not found',
        name: 'AuthApiError',
      };

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: mockError });

      const result = await service.resetPassword('nonexistent@example.com');

      expect(result.error).toEqual(mockError);
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({ error: null });

      const result = await service.updatePassword('newpassword123');

      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newpassword123',
      });

      expect(result.error).toBeNull();
    });

    it('should handle update password errors', async () => {
      const mockError: Partial<AuthError> = {
        message: 'Password update failed',
        name: 'AuthApiError',
      };

      mockSupabase.auth.updateUser.mockResolvedValue({ error: mockError });

      const result = await service.updatePassword('newpassword123');

      expect(result.error).toEqual(mockError);
    });
  });

  describe('updateEmail', () => {
    it('should update email successfully', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({ error: null });

      const result = await service.updateEmail('newemail@example.com');

      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        email: 'newemail@example.com',
      });

      expect(result.error).toBeNull();
    });
  });

  describe('updateUserMetadata', () => {
    it('should update user metadata successfully', async () => {
      const metadata = { firstName: 'Jane', lastName: 'Smith' };

      mockSupabase.auth.updateUser.mockResolvedValue({ error: null });

      const result = await service.updateUserMetadata(metadata);

      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        data: metadata,
      });

      expect(result.error).toBeNull();
    });
  });

  describe('getSession', () => {
    it('should retrieve current session', async () => {
      const mockSession: Partial<Session> = {
        access_token: 'token-123',
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await service.getSession();

      expect(mockSupabase.auth.getSession).toHaveBeenCalled();
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should return null when no session exists', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await service.getSession();

      expect(result.session).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should retrieve current user', async () => {
      const mockUser: Partial<User> = {
        id: 'user-123',
        email: 'test@example.com',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await service.getUser();

      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });
  });

  describe('resendConfirmationEmail', () => {
    it('should resend confirmation email successfully', async () => {
      mockSupabase.auth.resend.mockResolvedValue({ error: null });

      const result = await service.resendConfirmationEmail('test@example.com');

      expect(mockSupabase.auth.resend).toHaveBeenCalledWith({
        type: 'signup',
        email: 'test@example.com',
      });

      expect(result.error).toBeNull();
    });
  });

  describe('signInWithOAuth', () => {
    it('should initiate OAuth sign in with Google', async () => {
      const mockData = { url: 'https://accounts.google.com/...' };

      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await service.signInWithOAuth('google');

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      });

      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
    });

    it('should support multiple OAuth providers', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: {},
        error: null,
      });

      await service.signInWithOAuth('github');
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({ provider: 'github' })
      );

      await service.signInWithOAuth('facebook');
      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({ provider: 'facebook' })
      );
    });
  });

  describe('onAuthStateChange', () => {
    it('should listen to auth state changes', () => {
      const mockCallback = jest.fn();
      const mockSubscription = { unsubscribe: jest.fn() };

      mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: mockSubscription },
      });

      service.onAuthStateChange(mockCallback);

      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled();
    });
  });
});
