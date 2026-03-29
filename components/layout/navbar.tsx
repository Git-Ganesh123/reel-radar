"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";
import {
  Radar,
  LogIn,
  Bookmark,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-ink-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white transition-transform group-hover:scale-105">
            <Radar className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-semibold text-ink-900 tracking-tight">
            Reel Radar
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-ink-100" />
          ) : user ? (
            <>
              <Link
                href="/saved"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
              >
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-700">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-56 rounded-xl border border-ink-200 bg-white p-1.5 shadow-lg"
                    >
                      <div className="px-3 py-2 text-xs text-ink-400 truncate">
                        {user.email}
                      </div>
                      <div className="my-1 h-px bg-ink-100" />
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-ink-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-ink-700"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
