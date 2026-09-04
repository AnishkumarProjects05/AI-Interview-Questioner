"use client";

import React, { useState, useEffect } from "react";
import {
  Linkedin,
  Github,
  X,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    id: 1,
    color: "from-blue-500 to-blue-700",
    title: "Go to LinkedIn",
    description: 'Open LinkedIn, click "Me → View Profile" to reach your profile page.',
    linkLabel: "Open LinkedIn",
    linkHref: "https://www.linkedin.com",
  },
  {
    id: 2,
    color: "from-indigo-500 to-violet-600",
    title: "Copy your Profile URL",
    description: "Copy the URL from your browser address bar. It looks like:",
    code: "linkedin.com/in/your-username",
  },
  {
    id: 3,
    color: "from-emerald-500 to-teal-600",
    title: "Paste in Your Profile",
    description:
      'Click Profile Icon → View Profile → Edit Profile → paste in "LinkedIn Profile" field & Save.',
  },
];

export default function LinkedInSetupDialog() {
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!user?.email || hasChecked) return;

    const sessionKey = `linkedin_dialog_dismissed_${user.email}`;
    if (sessionStorage.getItem(sessionKey)) {
      setHasChecked(true);
      return;
    }

    const checkLinkedIn = async () => {
      try {
        const { data, error } = await supabase
          .from("user_details")
          .select("linkedinprofile")
          .eq("email", user.email)
          .maybeSingle();

        if (error) return;

        const hasLinkedIn = data?.linkedinprofile?.trim();
        if (!hasLinkedIn) {
          setTimeout(() => setIsOpen(true), 1200);
        }
      } catch (err) {
        console.warn("LinkedIn check failed:", err);
      } finally {
        setHasChecked(true);
      }
    };

    checkLinkedIn();
  }, [user, hasChecked]);

  const handleDismiss = () => {
    if (user?.email) {
      sessionStorage.setItem(`linkedin_dialog_dismissed_${user.email}`, "true");
    }
    setIsOpen(false);
  };

  const handleGoToProfile = () => {
    handleDismiss();
    router.push("/view-profile");
  };

  if (!isOpen) return null;

  return (
    /* ── Full-screen overlay ── */
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* ── Dialog Card ──
          Mobile  : slides up from bottom, full-width, rounded top corners, max 90dvh
          Desktop : centered card, max-w-lg, fully rounded
      */}
      <div
        className="
          relative w-full sm:max-w-lg
          bg-white dark:bg-slate-900
          rounded-t-3xl sm:rounded-3xl
          border border-slate-200 dark:border-white/10
          shadow-2xl shadow-black/40
          flex flex-col
          max-h-[90dvh] sm:max-h-[85vh]
          animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300
        "
      >
        {/* ── Gradient top bar (desktop) / drag pill (mobile) ── */}
        <div className="flex-shrink-0">
          {/* Mobile drag pill */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
          {/* Desktop gradient bar */}
          <div className="hidden sm:block h-1.5 w-full rounded-t-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600" />
        </div>

        {/* ── Header ── */}
        <div className="flex-shrink-0 px-5 sm:px-6 pt-3 sm:pt-5 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shadow">
                <AlertCircle className="w-2.5 h-2.5 text-amber-900" />
              </span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Link Your LinkedIn Profile
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Required to share interview experiences
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 space-y-3 pb-2">

          {/* Why it matters */}
          <div className="p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs text-indigo-800 dark:text-indigo-300 font-medium leading-relaxed">
              Our AI Auditor verifies your LinkedIn to ensure every interview
              experience in the community pool is{" "}
              <span className="font-black">genuine and credible</span>. Without
              it, you won't be able to share experiences.
            </p>
          </div>

          {/* Steps label */}
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1">
            How to add your LinkedIn
          </p>

          {/* Steps */}
          <div className="space-y-2">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="flex items-start gap-3 p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 rounded-2xl"
              >
                {/* Number badge */}
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5`}
                >
                  <span className="text-white text-[10px] sm:text-[11px] font-black">
                    {step.id}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                  {step.linkHref && (
                    <a
                      href={step.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {step.linkLabel}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {step.code && (
                    <code className="mt-1.5 block text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg truncate">
                      {step.code}
                    </code>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* GitHub bonus tip */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 rounded-2xl flex items-start gap-2.5">
            <Github className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Bonus:
              </span>{" "}
              You can also add your{" "}
              <span className="font-bold">GitHub & LeetCode</span> profiles to
              display live stats on your profile page.
            </p>
          </div>
        </div>

        {/* ── Sticky action buttons — always visible ── */}
        <div className="flex-shrink-0 px-5 sm:px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 rounded-b-3xl sm:rounded-b-3xl flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleGoToProfile}
            className="flex-1 flex items-center justify-center gap-2 h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Linkedin className="w-4 h-4" />
            Go to Profile & Link Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
