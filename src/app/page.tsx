"use client";
import HeroAnimation from "@/components/HeroAnimation";
import AuthForm from "@/components/AuthForm";
import Feed from "@/components/Feed";
import { useAuthUI } from "@/app/providers";
import { useAuthContext } from "@/contexts/AuthContext";
import ClientOnly from "@/components/ClientOnly";
import VisualEffectsWrapper from "@/components/VisualEffectsWrapper";

export default function Home() {
  const { showForm } = useAuthUI();
  const { user } = useAuthContext();

  return (
    <>
      {/* Only show visual effects when user is not authenticated */}
      {!user && (
        <ClientOnly>
          <VisualEffectsWrapper showNebula={showForm} />
        </ClientOnly>
      )}

      {/* Show Feed when logged in, otherwise show auth form or hero animation */}
      {user ? <Feed /> : showForm ? <AuthForm /> : <HeroAnimation />}
    </>
  );
}
