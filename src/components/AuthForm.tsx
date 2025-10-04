"use client";
import React, {useState, useEffect, useRef} from "react";
import {useAuthUI} from "@/app/providers";
import {authService} from "@/lib/auth/authService";
import { useAuthContext } from "@/contexts/AuthContext";

const IS_TEST = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;
const CLOSE_DELAY_MS = IS_TEST ? 5000 : 1500;

export default function AuthForm() {
    const {formMode, setFormMode, closeForm} = useAuthUI();
    const { user } = useAuthContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [blurred, setBlurred] = useState(true);
    const [visible, setVisible] = useState(false);
    const [visualMode, setVisualMode] = useState(formMode);
    const fadeTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setVisible(true);
        setBlurred(true);
        setTimeout(() => setBlurred(false), 1000);
    }, []);

    useEffect(() => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setMessage(null);
        setErrors({});
        setLoading(false);
    }, [visualMode]);

    useEffect(() => {
        if (formMode === visualMode) return;
        setVisible(false);
        if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
        fadeTimeout.current = setTimeout(() => {
            setVisualMode(formMode);
            setVisible(true);
        }, 350);
    }, [formMode, visualMode]);

    useEffect(() => {
        if (user) {
            closeForm();
        }
    }, [user, closeForm]);

    const isRegister = visualMode === "register";
    const isForgotPassword = visualMode === "forgot-password";
    const isResetPassword = visualMode === "reset-password";

    const validateEmail = (email: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!validateEmail(email)) errs.email = "Email inválido";

        if (!isForgotPassword) {
            if (password.length < 6) errs.password = "Mínimo 6 caracteres";
            if (isRegister && password !== confirmPassword) {
                errs.confirmPassword = "Las contraseñas no coinciden";
            }
            if (isResetPassword && password !== confirmPassword) {
                errs.confirmPassword = "Las contraseñas no coinciden";
            }
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!validate()) return;

        setLoading(true);

        try {
            if (isRegister) {
                const {error} = await authService.signUp({email, password});
                if (error) {
                    setMessage({text: error.message, type: 'error'});
                } else {
                    setMessage({
                        text: "¡Cuenta creada! Revisa tu email para confirmar tu registro.",
                        type: 'success'
                    });
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    // Auto-close after 3 seconds on success
                    setTimeout(() => closeForm(), 3000);
                }
            } else if (isForgotPassword) {
                const {error} = await authService.resetPassword(email);
                if (error) {
                    setMessage({text: error.message, type: 'error'});
                } else {
                    setMessage({
                        text: "Te enviamos un email con instrucciones para recuperar tu contraseña.",
                        type: 'success'
                    });
                    setEmail("");
                }
            } else if (isResetPassword) {
                const {error} = await authService.updatePassword(password);
                if (error) {
                    setMessage({text: error.message, type: 'error'});
                } else {
                    setMessage({text: "Contraseña actualizada exitosamente.", type: 'success'});
                    setTimeout(() => setFormMode("login"), 2000);
                }
            } else {
                // Login - close immediately on success
                const {error} = await authService.signIn({email, password});
                if (error) {
                    setMessage({text: error.message, type: 'error'});
                } else {
                    // Show welcome message briefly then close form
                    setMessage({text: "¡Bienvenido!", type: 'success'});
                    setTimeout(() => closeForm(), CLOSE_DELAY_MS);
                }
            }
        } catch {
            setMessage({text: "An unexpected error occurred.", type: 'error'});
        } finally {
            setLoading(false);
        }
    };

    const getFormTitle = () => {
        if (isRegister) return "Registrarse";
        if (isForgotPassword) return "Recuperar contraseña";
        if (isResetPassword) return "Nueva contraseña";
        return "Ingresar";
    };

    return (
        <div className="w-full flex items-center justify-center"
             style={{background: "transparent", color: "var(--text)", minHeight: "80vh"}}>
            <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12"
                 style={{position: 'relative', zIndex: 3}}>
                <div className={`hidden md:flex flex-col items-center justify-center gap-4 text-center transition-blur ${blurred ? 'blurred' : 'unblurred'}`}
                     style={{pointerEvents: "none"}}>
                    <span className="font-bold" style={{
                        color: "var(--text)",
                        fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)"
                    }}>Bienvenido</span>
                    <span className="font-extrabold tracking-wide" style={{
                        color: "var(--text)",
                        fontSize: "clamp(1.75rem, 4.2vw, 2.6rem)"
                    }}>omniconscientes</span>
                    <p className="leading-relaxed" style={{color: "var(--text-muted)", maxWidth: 420}}>
                        Un espacio para despertar, conectar y evolucionar.
                    </p>
                </div>
                <div className={`w-full fade-anim ${visible ? 'fade-in' : 'fade-out'}`}>
                    <div className="w-full max-w-md mx-auto p-8 rounded-lg shadow flex flex-col justify-center" style={{
                        background: "var(--surface)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                        minHeight: 520
                    }}>
                        <h1 id="authFormTitle" data-testid="auth-form-title" className="text-2xl font-extrabold mb-8 text-center">{getFormTitle()}</h1>
                        <form onSubmit={onSubmit} className="flex flex-col gap-6 flex-1 justify-between"
                              style={{minHeight: 320}}>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    data-testid="email-input"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 rounded border"
                                    style={{borderColor: errors.email ? "#ef4444" : "var(--border)"}}
                                    disabled={loading}
                                    required
                                />
                                {errors.email && <p data-testid="error-email" className="text-sm" style={{color: "#ef4444"}}>{errors.email}</p>}
                            </div>

                            {!isForgotPassword && (
                                <div>
                                    <label htmlFor="password">Contraseña</label>
                                    <input
                                        id="password"
                                        data-testid="password-input"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 rounded border"
                                        style={{borderColor: errors.password ? "#ef4444" : "var(--border)"}}
                                        disabled={loading}
                                        required
                                    />
                                    {errors.password && <p data-testid="error-password" className="text-sm" style={{color: "#ef4444"}}>{errors.password}</p>}
                                </div>
                            )}

                            {(isRegister || isResetPassword) && (
                                <div>
                                    <label htmlFor="confirm">Confirmar contraseña</label>
                                    <input
                                        id="confirm"
                                        data-testid="confirm-password-input"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 rounded border"
                                        style={{borderColor: errors.confirmPassword ? "#ef4444" : "var(--border)"}}
                                        disabled={loading}
                                        required
                                    />
                                    {errors.confirmPassword && <p data-testid="error-confirm" className="text-sm" style={{color: "#ef4444"}}>{errors.confirmPassword}</p>}
                                </div>
                            )}

                            <button
                                id="submitButton"
                                data-testid="submit-button"
                                type="submit"
                                className="w-full py-2 rounded font-semibold mt-2"
                                style={{background: "var(--primary)", color: "var(--text)", opacity: loading ? 0.6 : 1}}
                                disabled={loading}
                            >
                                {loading ? "Procesando..." : getFormTitle()}
                            </button>
                        </form>

                        {message && (
                            <div data-testid="form-message" className="mt-4 text-center text-sm p-3 rounded"
                                 style={{
                                     backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                     color: message.type === 'success' ? '#22c55e' : '#ef4444',
                                     border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`
                                 }}>
                                {message.text}
                            </div>
                        )}

                        <div className="mt-8 text-center text-sm flex flex-col gap-2">
                            {isRegister ? (
                                <>
                                    <span>
                                        ¿Ya tenés cuenta?{' '}
                                        <button id="linkLogin" data-testid="link-login" type="button" className="underline" style={{
                                            color: "var(--primary)",
                                            background: "none",
                                            border: "none",
                                            padding: 0,
                                            cursor: "pointer"
                                        }} onClick={() => setFormMode("login")}>Ingresá</button>
                                    </span>
                                </>
                            ) : isForgotPassword ? (
                                <span>
                                    <button id="linkBackLogin" data-testid="link-back-login" type="button" className="underline" style={{
                                        color: "var(--primary)",
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer"
                                    }} onClick={() => setFormMode("login")}>Volver al login</button>
                                </span>
                            ) : isResetPassword ? null : (
                                <>
                                    <span>
                                        ¿No tenés cuenta?{' '}
                                        <button id="linkRegister" data-testid="link-register" type="button" className="underline" style={{
                                            color: "var(--primary)",
                                            background: "none",
                                            border: "none",
                                            padding: 0,
                                            cursor: "pointer"
                                        }} onClick={() => setFormMode("register")}>Registrate</button>
                                    </span>
                                    <span>
                                        <button id="linkForgot" data-testid="link-forgot" type="button" className="underline" style={{
                                            color: "var(--text-muted)",
                                            background: "none",
                                            border: "none",
                                            padding: 0,
                                            cursor: "pointer"
                                        }} onClick={() => setFormMode("forgot-password")}>¿Olvidaste tu contraseña?</button>
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
