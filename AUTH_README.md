# Authentication System with Supabase

This document describes the complete implementation of the authentication system with Supabase for the omniconscientes application.

## 🚀 Features Implemented

### Authentication Functionalities

1. **User Registration**
   - Registration with email and password
   - Email validation
   - Email confirmation
   - Support for user metadata

2. **Login**
   - Login with email and password
   - Handling invalid credential errors
   - Session persistence

3. **Password Recovery**
   - Sending recovery email
   - Password update
   - New password validation

4. **Session Management**
   - Automatic session verification
   - Token renewal
   - Logout

5. **Profile Update**
   - Change email
   - Change password
   - Update user metadata

6. **OAuth (Ready)**
   - Support for Google, GitHub, Facebook, Twitter
   - Ready-to-use configuration

## 📁 File Structure

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase client for client components
│   │   ├── server.ts          # Supabase client for server components
│   │   └── middleware.ts      # Middleware for session management
│   └── auth/
│       ├── authService.ts     # Authentication service
│       └── __tests__/
│           └── authService.test.ts
├── hooks/
│   ├── useAuth.ts             # Hook to access authentication state
│   └── __tests__/
│       └── useAuth.test.ts
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── components/
│   ├── AuthForm.tsx           # Authentication form
│   └── __tests__/
│       └── AuthForm.test.tsx
├── app/
│   ├── providers.tsx          # Global providers
│   └── auth/
│       └── callback/
│           └── route.ts       # Callback route for confirmations
└── middleware.ts              # Next.js middleware
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 💻 Usage

### 1. useAuth Hook

```typescript
import { useAuthContext } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, session, loading, isAuthenticated } = useAuthContext();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return <div>Welcome {user.email}</div>;
}
```

### 2. AuthService - Registration

```typescript
import { authService } from '@/lib/auth/authService';

async function handleSignUp() {
  const { user, error } = await authService.signUp({
    email: 'user@example.com',
    password: 'password123',
    metadata: { firstName: 'John', lastName: 'Doe' }
  });

  if (error) {
    console.error('Registration error:', error.message);
  } else {
    console.log('User registered:', user);
  }
}
```

### 3. AuthService - Login

```typescript
async function handleSignIn() {
  const { user, session, error } = await authService.signIn({
    email: 'user@example.com',
    password: 'password123'
  });

  if (error) {
    console.error('Login error:', error.message);
  } else {
    console.log('Session started:', user);
  }
}
```

### 4. AuthService - Password Recovery

```typescript
async function handleForgotPassword() {
  const { error } = await authService.resetPassword('user@example.com');

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Recovery email sent');
  }
}
```

### 5. AuthService - Logout

```typescript
async function handleSignOut() {
  const { error } = await authService.signOut();

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Session closed');
  }
}
```

## 🧪 Tests

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Test Coverage

Tests cover the following cases:

- Registration (success and error)
- Login (success and invalid credentials)
- Password recovery
- Password reset
- Email change
- Password change
- Metadata update
- Get session and user
- Resend confirmation email
- OAuth multiple providers
- Listen and react to state changes

## 🔒 Security

1. **Passwords**: Minimum 6 characters required
2. **Email Validation**: Email format validated
3. **Session Tokens**: Automatically managed by Supabase
4. **HTTPS**: Required in production
5. **Middleware**: Automatically renews sessions

## 🎯 User Flows

### Registration Flow
1. User fills out the registration form
2. System validates data
3. Account is created in Supabase
4. Confirmation email is sent
5. User confirms email
6. Account activated

### Login Flow
1. User enters credentials
2. System validates credentials
3. Supabase creates session
4. User authenticated
5. Form closes automatically

### Password Recovery Flow
1. User requests recovery
2. System sends email with link
3. User clicks on link
4. User enters new password
5. Password updated
6. Redirects to login

## 📝 Important Notes

1. **Email Confirmation**: By default, Supabase requires email confirmation. This can be configured in the Supabase dashboard.
2. **Redirects**: Callbacks are configured for `/auth/callback`. Make sure to add this URL in the Supabase configuration.
3. **OAuth**: To use OAuth, you must configure the providers in the Supabase dashboard.
4. **Middleware**: The middleware runs on all routes to keep sessions updated.

## 🐛 Debugging

If you encounter issues:

1. Ensure that the environment variables are correctly configured
2. Check the browser console for errors
3. Check the Supabase dashboard for authentication logs
4. Make sure the callback URLs are configured in Supabase

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
