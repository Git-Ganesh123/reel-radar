import { AuthForm } from "@/components/ui/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Reel Radar",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
