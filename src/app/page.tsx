"use client";
import HeroAnimation from "@/components/HeroAnimation";
import AuthForm from "@/components/AuthForm";
import { useAuthUI } from "@/app/providers";
import ClientOnly from "@/components/ClientOnly";
import VisualEffectsWrapper from "@/components/VisualEffectsWrapper";

export default function Home() {
  const { showForm } = useAuthUI();
  return (
    <>
      <ClientOnly>
        <VisualEffectsWrapper showNebula={showForm} />
      </ClientOnly>
      {showForm ? <AuthForm /> : <HeroAnimation />}
    </>
  );
}
