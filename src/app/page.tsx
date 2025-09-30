"use client";
import HeroAnimation from "@/components/HeroAnimation";
import AuthForm from "@/components/AuthForm";
import { useAuthUI } from "@/app/providers";

export default function Home() {
  const { showForm } = useAuthUI();
  return showForm ? <AuthForm /> : <HeroAnimation />;
}
