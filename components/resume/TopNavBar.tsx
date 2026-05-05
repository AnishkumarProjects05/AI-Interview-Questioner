"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Moon, Sun, FileText, ArrowLeft, LogOut } from "lucide-react";
import { useUser } from "@/app/provider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";

export const TopNavBar = () => {
  const pathName = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const ctx = useUser();
  const theme = ctx?.theme;
  const toggleTheme = ctx?.toggleTheme;
  const user = ctx?.user;
  const setUser = ctx?.setUser;

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    if (!supabase) return;
    if (setUser) setUser(null);
    await supabase.auth.signOut();
    router.replace('/auth');
  }

  const navLinks = [
    { href: "/resume-builder", label: "Builder" },
    { href: "/resume-parser", label: "Parser" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto h-16 max-w-full px-6 flex items-center justify-between gap-4">

        {/* Left: Back + Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

          <Link href="/resume-builder" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/30">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 dark:text-white tracking-tight text-sm hidden sm:inline">
              Resume Studio
            </span>
          </Link>
        </div>

        {/* Center: Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathName === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Sponsor badge + Theme toggle */}
        <div className="flex items-center gap-2">
          {/* Sponsored by Folonite */}
          <a
            href="https://folonite.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-violet-200 dark:border-violet-500/30 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 px-3 py-1 text-xs font-semibold text-violet-700 dark:text-violet-400 shadow-sm transition-all hover:border-violet-400 dark:hover:border-violet-400 hover:shadow-violet-200/60"
          >
            <span className="animate-pulse">✦</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">Powered by</span>
            <span className="font-bold">Folonite Team</span>
          </a>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 shadow-sm"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* User Avatar & Dropdown */}
          <div className="relative ml-2">
            <div
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 border-2 border-white dark:border-white/20 shadow-lg flex items-center justify-center text-white font-black text-xs cursor-pointer hover:scale-105 transition-transform"
            >
              {userInitial}
            </div>

            {/* Dropdown */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Account</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || "User"}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
