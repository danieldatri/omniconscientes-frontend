"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroAnimation from "@/components/HeroAnimation";
import AuthForm from "@/components/AuthForm";
import { useAuthUI } from "@/app/providers";
import { useAuthContext } from "@/contexts/AuthContext";
import ClientOnly from "@/components/ClientOnly";
import VisualEffectsWrapper from "@/components/VisualEffectsWrapper";

export default function Home() {
  const { showForm } = useAuthUI();
  const { user, loading } = useAuthContext();
  const router = useRouter();

  // Redirect authenticated users to home
  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render content if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <>
      {/* Visual effects for landing page */}
      <ClientOnly>
        <VisualEffectsWrapper showNebula={showForm} />
      </ClientOnly>

      {/* Landing page content - show auth form or hero animation */}
      {showForm ? <AuthForm /> : <HeroAnimation />}
    </>
  );
}
