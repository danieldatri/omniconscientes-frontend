import { createClient } from '@/lib/supabase/client';
import type { AuthError, User, Session } from '@supabase/supabase-js';

export interface AuthResult {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface SignUpData {
  email: string;
  password: string;
  metadata?: Record<string, unknown>;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  private supabase = createClient();
  private baseUrl: string;

  constructor() {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SUPABASE_SITE_URL;
    if (envUrl) {
      this.baseUrl = envUrl.replace(/\/$/, '');
    } else if (typeof window !== 'undefined' && window.location?.origin) {
      // Jsdom sometimes reports http://localhost without port; default to 3000 for local dev
      const origin = window.location.origin === 'http://localhost' ? 'http://localhost:3000' : window.location.origin;
      this.baseUrl = origin.replace(/\/$/, '');
    } else {
      this.baseUrl = 'http://localhost:3000';
    }
  }

  /**
   * Register a new user with email and password
   */
  async signUp({ email, password, metadata }: SignUpData): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${this.baseUrl}/auth/callback`,
      },
    });

    return {
      user: data.user,
      session: data.session,
      error,
    };
  }

  /**
   * Sign in with email and password
   */
  async signIn({ email, password }: SignInData): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user,
      session: data.session,
      error,
    };
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${this.baseUrl}/auth/reset-password`,
    });
    return { error };
  }

  /**
   * Update user password (requires current session)
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  }

  /**
   * Update user email (requires current session)
   */
  async updateEmail(newEmail: string): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.updateUser({
      email: newEmail,
    });
    return { error };
  }

  /**
   * Update user metadata
   */
  async updateUserMetadata(metadata: Record<string, unknown>): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.updateUser({
      data: metadata,
    });
    return { error };
  }

  /**
   * Get current session
   */
  async getSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    const { data, error } = await this.supabase.auth.getSession();
    return { session: data.session, error };
  }

  /**
   * Get current user
   */
  async getUser(): Promise<{ user: User | null; error: AuthError | null }> {
    const { data, error } = await this.supabase.auth.getUser();
    return { user: data.user, error };
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmationEmail(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email,
    });
    return { error };
  }

  /**
   * Sign in with OAuth provider (Google, GitHub, etc.)
   */
  async signInWithOAuth(provider: 'google' | 'github' | 'facebook' | 'twitter') {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${this.baseUrl}/auth/callback`,
      },
    });
    return { data, error };
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
}

// Export a singleton instance
const authServiceInstance = new AuthService();
export { authServiceInstance as authService };
