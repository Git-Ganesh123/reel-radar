"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, Radar } from "lucide-react";
import { signIn, signUp } from "@/lib/auth";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
        router.push("/");
        router.refresh();
      } else {
        await signUp(email, password);
        setSignupSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (signupSuccess) {
    return (
      <div className="w-full max-w-sm mx-auto text-center">
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
            <Radar className="h-6 w-6 text-brand-600" />
          </div>
          <h2 className="text-lg font-semibold text-ink-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex rounded-xl bg-ink-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-ink-700 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Radar className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-ink-900 tracking-tight">
            Reel Radar
          </span>
        </Link>
        <h1 className="text-2xl font-semibold text-ink-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1.5 text-sm text-ink-500">
          {mode === "login"
            ? "Sign in to access your saved trends"
            : "Start discovering viral trends for free"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-ink-700 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-ink-700 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="••••••••"
            minLength={6}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink-700 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
