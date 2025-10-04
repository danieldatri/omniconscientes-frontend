import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '@/components/AuthForm';
import { authService } from '@/lib/auth/authService';
import { useAuthUI } from '@/app/providers';
import { useAuthContext } from '@/contexts/AuthContext';

// Mock dependencies
jest.mock('@/lib/auth/authService');
jest.mock('@/app/providers');
jest.mock('@/contexts/AuthContext');

describe('AuthForm', () => {
  const mockSetFormMode = jest.fn();
  const mockCloseForm = jest.fn();

  beforeEach(() => {
    (useAuthUI as jest.Mock).mockReturnValue({
      formMode: 'login',
      setFormMode: mockSetFormMode,
      closeForm: mockCloseForm,
    });

    (useAuthContext as jest.Mock).mockReturnValue({
      user: null,
      session: null,
      loading: false,
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Form', () => {
    it('should render login form', () => {
      render(<AuthForm />);

      const title = screen.getByTestId('auth-form-title');
      expect(title).toHaveTextContent(/Ingresar/i);
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
    });

    it('should validate email format', async () => {
      render(<AuthForm />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-email')).toHaveTextContent('Email inválido');
      });
    });

    it('should validate password length', async () => {
      render(<AuthForm />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, '12345');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-password')).toHaveTextContent('Mínimo 6 caracteres');
      });
    });

    it('should successfully sign in with valid credentials', async () => {
      (authService.signIn as jest.Mock).mockResolvedValue({
        user: { id: 'user-123', email: 'test@example.com' },
        session: { access_token: 'token' },
        error: null,
      });

      render(<AuthForm />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.signIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId('form-message')).toHaveTextContent('¡Bienvenido!');
      });
    });

    it('should display error message on failed login', async () => {
      (authService.signIn as jest.Mock).mockResolvedValue({
        user: null,
        session: null,
        error: { message: 'Invalid login credentials' },
      });

      render(<AuthForm />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'wrongpassword');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('form-message')).toHaveTextContent('Invalid login credentials');
      });
    });

    it('should switch to register form', async () => {
      render(<AuthForm />);

      const registerLink = screen.getByTestId('link-register');
      fireEvent.click(registerLink);

      expect(mockSetFormMode).toHaveBeenCalledWith('register');
    });

    it('should switch to forgot password form', async () => {
      render(<AuthForm />);

      const forgotPasswordLink = screen.getByTestId('link-forgot');
      fireEvent.click(forgotPasswordLink);

      expect(mockSetFormMode).toHaveBeenCalledWith('forgot-password');
    });
  });

  describe('Register Form', () => {
    beforeEach(() => {
      (useAuthUI as jest.Mock).mockReturnValue({
        formMode: 'register',
        setFormMode: mockSetFormMode,
        closeForm: mockCloseForm,
      });
    });

    it('should render register form', () => {
      render(<AuthForm />);

      expect(screen.getByTestId('auth-form-title')).toHaveTextContent('Registrarse');
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    });

    it('should validate password match', async () => {
      render(<AuthForm />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password456');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-confirm')).toHaveTextContent('Las contraseñas no coinciden');
      });
    });

    it('should successfully register with valid data', async () => {
      (authService.signUp as jest.Mock).mockResolvedValue({
        user: { id: 'user-123', email: 'test@example.com' },
        session: null,
        error: null,
      });

      render(<AuthForm />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password123');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.signUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId('form-message')).toHaveTextContent('¡Cuenta creada!');
      });
    });

    it('should switch to login form', async () => {
      render(<AuthForm />);

      const loginLink = screen.getByTestId('link-login');
      fireEvent.click(loginLink);

      expect(mockSetFormMode).toHaveBeenCalledWith('login');
    });
  });

  describe('Forgot Password Form', () => {
    beforeEach(() => {
      (useAuthUI as jest.Mock).mockReturnValue({
        formMode: 'forgot-password',
        setFormMode: mockSetFormMode,
        closeForm: mockCloseForm,
      });
    });

    it('should render forgot password form', () => {
      render(<AuthForm />);

      expect(screen.getByTestId('auth-form-title')).toHaveTextContent('Recuperar contraseña');
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.queryByTestId('password-input')).not.toBeInTheDocument();
    });

    it('should send password reset email', async () => {
      (authService.resetPassword as jest.Mock).mockResolvedValue({
        error: null,
      });

      render(<AuthForm />);

      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      await userEvent.type(emailInput, 'test@example.com');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com');
      });

      await waitFor(() => {
        expect(screen.getByTestId('form-message')).toHaveTextContent('Te enviamos un email');
      });
    });

    it('should return to login form', async () => {
      render(<AuthForm />);

      const backLink = screen.getByTestId('link-back-login');
      fireEvent.click(backLink);

      expect(mockSetFormMode).toHaveBeenCalledWith('login');
    });
  });

  describe('Reset Password Form', () => {
    beforeEach(() => {
      (useAuthUI as jest.Mock).mockReturnValue({
        formMode: 'reset-password',
        setFormMode: mockSetFormMode,
        closeForm: mockCloseForm,
      });
    });

    it('should render reset password form', () => {
      render(<AuthForm />);

      expect(screen.getByTestId('auth-form-title')).toHaveTextContent('Nueva contraseña');
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    });

    it('should update password successfully', async () => {
      (authService.updatePassword as jest.Mock).mockResolvedValue({
        error: null,
      });

      render(<AuthForm />);

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');
      const submitButton = screen.getByTestId('submit-button');

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'newpassword123');
      await userEvent.type(confirmPasswordInput, 'newpassword123');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authService.updatePassword).toHaveBeenCalledWith('newpassword123');
      });

      await waitFor(() => {
        expect(screen.getByTestId('form-message')).toHaveTextContent('Contraseña actualizada');
      });
    });
  });

  describe('Loading State', () => {
    it('should disable form inputs while loading', async () => {
      (authService.signIn as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  user: { id: 'user-123' },
                  session: {},
                  error: null,
                }),
              100
            )
          )
      );

      render(<AuthForm />);

      const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
      const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
      const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement;

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(emailInput.disabled).toBe(true);
        expect(passwordInput.disabled).toBe(true);
        expect(submitButton.disabled).toBe(true);
      });
    });
  });

  describe('Auto-close on authentication', () => {
    it('should close form when user becomes authenticated', () => {
      const { rerender } = render(<AuthForm />);

      expect(mockCloseForm).not.toHaveBeenCalled();

      // Simulate user authentication
      (useAuthContext as jest.Mock).mockReturnValue({
        user: { id: 'user-123', email: 'test@example.com' },
        session: { access_token: 'token' },
        loading: false,
        isAuthenticated: true,
      });

      rerender(<AuthForm />);

      expect(mockCloseForm).toHaveBeenCalled();
    });
  });
});
