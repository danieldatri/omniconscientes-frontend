import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/auth/authService';
import type { Session, User } from '@supabase/supabase-js';

jest.mock('@/lib/auth/authService');

describe('useAuth', () => {
  let mockSession: Partial<Session>;
  let mockUser: Partial<User>;
  let mockUnsubscribe: jest.Mock;
  let mockOnAuthStateChange: jest.Mock;

  beforeEach(() => {
    mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    };

    mockSession = {
      access_token: 'token-123',
      user: mockUser as User,
    };

    mockUnsubscribe = jest.fn();
    mockOnAuthStateChange = jest.fn(() => {
      return {
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe,
          },
        },
      };
    });

    (authService.getSession as jest.Mock).mockResolvedValue({
      session: mockSession,
    });

    // Reemplazamos la función onAuthStateChange del servicio mockeado
    // @ts-expect-error reasignación deliberada para test
    authService.onAuthStateChange = mockOnAuthStateChange;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should load user session on mount', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle no session', async () => {
    (authService.getSession as jest.Mock).mockResolvedValue({
      session: null,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should listen to auth state changes', async () => {
    renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });
  });

  it('should update state when auth changes', async () => {
    let authCallback: (event: string, session: Session | null) => void = () => {};

    mockOnAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return {
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      };
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Simulate sign out
    authCallback('SIGNED_OUT', null);

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it('should unsubscribe on unmount', async () => {
    const { unmount } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
