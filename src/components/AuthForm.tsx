"use client";
import React, { useState, useEffect } from "react";
import { useAuthUI } from "@/app/providers";

export default function AuthForm() {
  const { formMode, setFormMode } = useAuthUI();
  const isRegister = formMode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage(null);
    setErrors({});
  }, [formMode]);

  const validateEmail = (email: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!validateEmail(email)) errs.email = "Email inválido";
    if (password.length < 6) errs.password = "Mínimo 6 caracteres";
    if (isRegister && password !== confirmPassword) errs.confirmPassword = "Las contraseñas no coinciden";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;
    setMessage(isRegister ? "Cuenta creada correctamente (simulado)." : "Acceso exitoso (simulado)." );
    setEmail(""); setPassword(""); setConfirmPassword("");
  };

  return (
    <div className="w-full flex items-center justify-center" style={{ background: "transparent", color: "var(--text)", minHeight: "80vh" }}>
      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12" style={{ position: 'relative', zIndex: 3 }}>
        <div className="hidden md:flex flex-col items-center justify-center gap-4 text-center">
          <span className="font-extrabold tracking-wide" style={{ color: "var(--text)", fontSize: "clamp(1.75rem, 4.2vw, 2.6rem)" }}>omniconscientes</span>
          <p className="leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: 420 }}>
            Donde la espiritualidad se encuentra con la transformación personal.
          </p>
        </div>
        <div className="w-full">
          <div className="w-full max-w-md mx-auto p-8 rounded-lg shadow flex flex-col justify-center" style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", minHeight: 520 }}>
            <h1 className="text-2xl font-extrabold mb-8 text-center">{isRegister ? "Registrarse" : "Ingresar"}</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-6 flex-1 justify-between" style={{ minHeight: 320 }}>
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: errors.email ? "#ef4444" : "var(--border)" }} />
                {errors.email && <p className="text-sm" style={{ color: "#ef4444" }}>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password">Contraseña</label>
                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: errors.password ? "#ef4444" : "var(--border)" }} />
                {errors.password && <p className="text-sm" style={{ color: "#ef4444" }}>{errors.password}</p>}
              </div>
              <div style={!isRegister ? { visibility: "hidden" } : {}}>
                <label htmlFor="confirm">Confirmar contraseña</label>
                <input id="confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: errors.confirmPassword ? "#ef4444" : "var(--border)" }} readOnly={!isRegister} />
                {errors.confirmPassword && <p className="text-sm" style={{ color: "#ef4444" }}>{errors.confirmPassword}</p>}
              </div>
              <button type="submit" className="w-full py-2 rounded font-semibold mt-2" style={{ background: "var(--primary)", color: "var(--text)" }}>
                {isRegister ? "Crear cuenta" : "Ingresar"}
              </button>
            </form>
            {message && <div className="mt-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>{message}</div>}
            <div className="mt-8 text-center">
              {isRegister ? (
                <span>
                  ¿Ya tenés cuenta?{' '}
                  <button type="button" className="underline" style={{ color: "var(--primary)", background: "none", border: "none", padding: 0, cursor: "pointer" }} onClick={() => setFormMode("login")}>Ingresá</button>
                </span>
              ) : (
                <span>
                  ¿No tenés cuenta?{' '}
                  <button type="button" className="underline" style={{ color: "var(--primary)", background: "none", border: "none", padding: 0, cursor: "pointer" }} onClick={() => setFormMode("register")}>Registrate</button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
