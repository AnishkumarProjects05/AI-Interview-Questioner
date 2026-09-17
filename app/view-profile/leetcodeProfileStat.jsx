"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Code2 } from "lucide-react";

export default function LeetCodeStats({ username }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLeetCodeMetrics() {
      if (
        !username ||
        username.toString().includes(" ") ||
        username === "undefined"
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const formattedUsername = username
          .toString()
          .trim()
          .replace(/\/+$/, "")
          .split("/")
          .pop()
          .replace(/\s+/g, "_");

        

        const response = await fetch(
          `https://leetcode-api-faisalshohag.vercel.app/${formattedUsername}`
        );

        if (!response.ok) {
          throw new Error("Profile not found or API down");
        }

        const data = await response.json();

        

        if (data.errors || data.totalSolved === undefined) {
          throw new Error("User does not exist on LeetCode");
        }

        // Store EVERYTHING dynamically
        setStats({
          // Solved
          totalSolved: data.totalSolved ?? 0,
          easySolved: data.easySolved ?? 0,
          mediumSolved: data.mediumSolved ?? 0,
          hardSolved: data.hardSolved ?? 0,

          // Total problems available
          totalEasy: data.totalEasy ?? 0,
          totalMedium: data.totalMedium ?? 0,
          totalHard: data.totalHard ?? 0,
        });
      } catch (err) {
        console.warn("⚠️ LeetCode API Error:", err.message);

        // Don't use fake statistics
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    getLeetCodeMetrics();
  }, [username]);

  if (loading) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-xs text-slate-500 mt-2">
          Syncing live DSA metrics...
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-center min-h-[220px]">
        <p className="text-sm text-slate-500">
          Unable to load LeetCode statistics.
        </p>
      </div>
    );
  }

  // Dynamic total problem pool
  const totalPlatformPool =
    stats.totalEasy +
    stats.totalMedium +
    stats.totalHard;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-amber-500" />
          DSA Progress
        </h3>

        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          LeetCode
        </span>
      </div>

      {/* Analytics */}
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">

        {/* Progress Ring */}
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">

          <div className="absolute inset-0 rounded-full border-4 border-slate-800" />

          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-amber-400"
            style={{ transform: "rotate(-45deg)" }}
          />

          <div className="text-center z-10">
            <span className="block text-2xl font-bold text-white tracking-tight">
              {stats.totalSolved}
            </span>

            <span className="block text-[10px] text-slate-500 font-medium uppercase tracking-wider border-t border-slate-800 pt-0.5 mt-0.5">
              /{totalPlatformPool}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2.5 w-full">

          {/* Easy */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Easy
            </div>

            <span className="font-semibold text-slate-200">
              {stats.easySolved}
              <span className="text-slate-600 font-normal">
                /{stats.totalEasy}
              </span>
            </span>
          </div>

          {/* Medium */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Medium
            </div>

            <span className="font-semibold text-slate-200">
              {stats.mediumSolved}
              <span className="text-slate-600 font-normal">
                /{stats.totalMedium}
              </span>
            </span>
          </div>

          {/* Hard */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Hard
            </div>

            <span className="font-semibold text-slate-200">
              {stats.hardSolved}
              <span className="text-slate-600 font-normal">
                /{stats.totalHard}
              </span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}