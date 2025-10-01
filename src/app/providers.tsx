"use client";

import { ThemeProvider } from "next-themes";
import React, { createContext, useContext, useState } from "react";

export type AuthMode = "login" | "register";

export type AuthUIContextValue = {
  showForm: boolean;
  formMode: AuthMode;
  openForm: (mode?: AuthMode) => void;
  closeForm: () => void;
  setFormMode: (mode: AuthMode) => void;
};

const AuthUIContext = createContext<AuthUIContextValue | undefined>(undefined);

export function useAuthUI(): AuthUIContextValue {
  const ctx = useContext(AuthUIContext);
  if (!ctx) throw new Error("useAuthUI must be used within Providers");
  return ctx;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<AuthMode>("login");

  const openForm = (mode?: AuthMode) => {
    if (mode) setFormMode(mode);
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      value={{ light: "theme-light", dark: "theme-dark" }}
      disableTransitionOnChange
    >
      <AuthUIContext.Provider value={{ showForm, formMode, openForm, closeForm, setFormMode }}>
        {children}
      </AuthUIContext.Provider>
    </ThemeProvider>
  );
}
