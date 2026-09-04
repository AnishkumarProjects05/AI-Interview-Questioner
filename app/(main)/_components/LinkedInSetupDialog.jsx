"use client";

import React, { useState, useEffect } from "react";
import {
  Linkedin,
  Github,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    id: 1,
    icon: Linkedin,
    color: "from-blue-500 to-blue-700",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    title: "Go to LinkedIn",
    description: 'Open LinkedIn and go to your profile page by clicking "Me → View Profile".',
    linkLabel: "Open LinkedIn →",
    linkHref: "https://www.linkedin.com",
  },
  {
    id: 2,
    icon: ExternalLink,
    color: "from-indigo-500 to-violet-600",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    title: "Copy your Profile URL",
    description:
      'Your profile URL looks like: linkedin.com/in/your-name. Copy it from the browser address bar.',
    code: "https://linkedin.com/in/your-username",
  },
  {
    id: 3,
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    title: "Paste it in your Profile",
    description:
      'Go to Profile Icon → View Profile → Edit Profile, and paste the URL in "LinkedIn Profile" field and save.',
  },
];

export default function LinkedInSetupDialog() {
  const { user } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only run once per session per user
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

        // If no record exists OR linkedin is empty → show dialog
        const hasLinkedIn = data?.linkedinprofile?.trim();
        if (!hasLinkedIn) {
          // Small delay so the page fully loads before the dialog pops
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
    setIsDismissed(true);
  };

  const handleGoToProfile = () => {
    handleDismiss();
    router.push("/view-profile");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={handleDismiss}
      />

      {/* Dialog Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-indigo-500/10 dark:shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Top Gradient Banner */}
        <div className="relative h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600" />

        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Animated LinkedIn Icon */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              <Linkedin className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                <AlertCircle className="w-2.5 h-2.5 text-amber-900" />
              </span>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                Link Your LinkedIn Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Required to share interview experiences
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Why it matters */}
        <div className="mx-6 mb-5 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-800 dark:text-indigo-300 font-medium leading-relaxed">
            Our AI Auditor verifies your LinkedIn to ensure every interview experience
            in the community pool is <span className="font-black">genuine and credible</span>.
            Without it, you won't be able to share experiences.
          </p>
        </div>

        {/* Step-by-step guide */}
        <div className="px-6 space-y-3 mb-5">
          <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            How to add your LinkedIn
          </p>

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 rounded-2xl"
              >
                {/* Step number badge */}
                <div
                  className={`w-7 h-7 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  <span className="text-white text-[11px] font-black">{step.id}</span>
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
            );
          })}
        </div>

        {/* Also mention GitHub */}
        <div className="mx-6 mb-5 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center gap-2.5">
          <Github className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="font-bold text-slate-700 dark:text-slate-300">Bonus:</span>{" "}
            You can also add your <span className="font-bold">GitHub & LeetCode</span> profiles
            to display live stats on your profile page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGoToProfile}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Linkedin className="w-4 h-4" />
            Go to Profile & Link Now
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleDismiss}
            className="sm:w-auto px-5 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-2xl transition-all active:scale-95"
          >
            Remind me later
          </button>
        </div>
      </div>
    </div>
  );
}
